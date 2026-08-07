/* This class uses protocol information from at https://github.com/cdump/radiacode/blob/master/src/radiacode*/

//import { COMMAND, VSFR } from './protocol';
import { BytesBuffer, parseResponsePacket } from './parsing';

export class ProtocolManager {
  notifyCharacteristic: BluetoothRemoteGATTCharacteristic | undefined;
  writeCharacteristic: BluetoothRemoteGATTCharacteristic | undefined;
  sequence: any = 0x80; // Initialize sequence to 0x80

  constructor(
    notifyCharacteristic: BluetoothRemoteGATTCharacteristic | undefined,
    writeCharacteristic: BluetoothRemoteGATTCharacteristic | undefined
  ) {
    this.notifyCharacteristic = notifyCharacteristic;
    this.writeCharacteristic = writeCharacteristic;
  }

  // public init that callers can await
  public async init(): Promise<void> {
    await this.addListeners();
  }

  private async addListeners(): Promise<void> {
    if (!this.notifyCharacteristic) {
      throw new Error('Notification characteristic is not available.');
    }

    if (!this.writeCharacteristic) {
      throw new Error('Write characteristic is not available.');
    }

    await this.notifyCharacteristic.startNotifications();
    this.notifyCharacteristic.addEventListener(
      'characteristicvaluechanged',
      (event: any) => this.handleNotification(event as Event)
    );
  }

  /**
   * Handle incoming notifications from the device
   * (Currently logs the data; can be extended for buffering if needed)
   */
  private handleNotification(ev: Event): void {
    const characteristic = ev.target as BluetoothRemoteGATTCharacteristic;
    if (!characteristic || !characteristic.value) return;

    const data = new Uint8Array(
      characteristic.value.buffer,
      characteristic.value.byteOffset,
      characteristic.value.byteLength
    );

    console.log('notification received:', data);
  }

  /**
   * Write a packet to the device in chunks (max 18 bytes per chunk)
   * @param packet Uint8Array packet to write
   */
  async writePacket(packet: Uint8Array): Promise<void> {
    if (!this.writeCharacteristic) {
      throw new Error('Write characteristic is not available.');
    }

    const maxPacketSize = 18;
    for (let offset = 0; offset < packet.length; offset += maxPacketSize) {
      const chunk = packet.slice(offset, offset + maxPacketSize);
      console.log(
        'TX:',
        [...chunk].map(b => b.toString(16).padStart(2, '0')).join(' ')
      );
      await this.writeCharacteristic.writeValue(chunk);
      console.log('chunk written:', chunk);
    }
  }

  /**
   * Build a complete packet with length header, command, and data
   * @param command Command ID
   * @param data Command data/arguments
   * @returns Complete packet as Uint8Array
   */
  buildPacket(
    command: number,
    data: Uint8Array = new Uint8Array()
  ): Uint8Array {
    const payloadLength = 4 + data.length; // 4 bytes for header + data

    const packet = new Uint8Array(4 + payloadLength);
    const view = new DataView(packet.buffer);

    // Payload length (little-endian)
    view.setUint32(0, payloadLength, true);

    // Command (little-endian)
    view.setUint16(4, command, true);

    // Reserved byte
    view.setUint8(6, 0);

    // Sequence number
    view.setUint8(7, this.sequence);

    // Command data
    packet.set(data, 8);

    // Increment sequence for next request (wraps at 32 values: 0x80-0x9F)
    this.sequence = 0x80 + ((this.sequence - 0x80 + 1) % 32);

    return packet;
  }

  /**
   * Read data from a device register
   * Sends a read command and waits for the response, then parses it
   * @param register Register data to read
   * @param command Command type (e.g., COMMAND.RD_VIRT_SFR)
   * @param dataName Name of the data being read (for logging)
   * @returns Parsed value from the response
   */
  async readData(
    register: Uint8Array,
    command: number,
    dataName: string
  ): Promise<number> {
    if (!this.notifyCharacteristic) {
      throw new Error('Notification characteristic is not available.');
    }
    if (!this.writeCharacteristic) {
      throw new Error('Write characteristic is not available.');
    }

    const packet = this.buildPacket(command, register);

    // Promise that resolves when we receive a complete response
    const responsePromise = new Promise<BytesBuffer>((resolve, reject) => {
      const handler = (event: Event) => {
        const characteristic =
          event.target as BluetoothRemoteGATTCharacteristic;
        if (!characteristic || !characteristic.value) {
          return;
        }

        const response = new Uint8Array(
          characteristic.value.buffer,
          characteristic.value.byteOffset,
          characteristic.value.byteLength
        );

        // Parse the response packet and extract payload
        try {
          const buffer = parseResponsePacket(response);

          // Cleanup
          characteristic.removeEventListener(
            'characteristicvaluechanged',
            handler
          );
          clearTimeout(timeoutId);
          resolve(buffer);
        } catch (error) {
          characteristic.removeEventListener(
            'characteristicvaluechanged',
            handler
          );
          clearTimeout(timeoutId);
          reject(error);
        }
      };

      // Register the handler for this read
      this.notifyCharacteristic!.addEventListener(
        'characteristicvaluechanged',
        handler
      );

      // Timeout after 5 seconds
      const timeoutId = setTimeout(() => {
        try {
          this.notifyCharacteristic!.removeEventListener(
            'characteristicvaluechanged',
            handler
          );
        } catch (e) {}
        reject(new Error('Timeout waiting for device response'));
      }, 5000);
    });

    // Send the request packet
    await this.writePacket(packet);

    // Wait for the response
    const responseBuffer = await responsePromise;

    // Parse response - extract the value (last 4 bytes as uint32 LE)
    // Adjust parsing based on your actual protocol response format
    const view = new DataView(
      responseBuffer.data.buffer,
      responseBuffer.data.byteOffset,
      responseBuffer.data.byteLength
    );
    console.log('view:', view);

    // If the response has data after the 4-byte header, read the value
    if (responseBuffer.size() >= 4) {
      const value = responseBuffer.readUint32LE();
      console.log(`Radiacode ${dataName}:`, value);
      return value;
    } else {
      throw new Error(`Unexpected response format for ${dataName}`);
    }
  }

  /**
   * Alternative: Read data and return the complete BytesBuffer
   * This gives more control over response parsing
   * @param register Register data
   * @param command Command type
   * @param dataName Name for logging
   * @returns BytesBuffer with full response data
   */
  async readDataRaw(
    register: Uint8Array,
    command: number,
    dataName: string
  ): Promise<BytesBuffer> {
    if (!this.notifyCharacteristic) {
      throw new Error('Notification characteristic is not available.');
    }
    if (!this.writeCharacteristic) {
      throw new Error('Write characteristic is not available.');
    }

    const packet = this.buildPacket(command, register);

    const responsePromise = new Promise<BytesBuffer>((resolve, reject) => {
      const handler = (event: Event) => {
        const characteristic =
          event.target as BluetoothRemoteGATTCharacteristic;
        if (!characteristic || !characteristic.value) {
          return;
        }

        const response = new Uint8Array(
          characteristic.value.buffer,
          characteristic.value.byteOffset,
          characteristic.value.byteLength
        );

        try {
          const buffer = parseResponsePacket(response);

          characteristic.removeEventListener(
            'characteristicvaluechanged',
            handler
          );
          clearTimeout(timeoutId);
          resolve(buffer);
        } catch (error) {
          characteristic.removeEventListener(
            'characteristicvaluechanged',
            handler
          );
          clearTimeout(timeoutId);
          reject(error);
        }
      };

      this.notifyCharacteristic!.addEventListener(
        'characteristicvaluechanged',
        handler
      );

      const timeoutId = setTimeout(() => {
        try {
          this.notifyCharacteristic!.removeEventListener(
            'characteristicvaluechanged',
            handler
          );
        } catch (e) {}
        reject(new Error('Timeout waiting for device response'));
      }, 5000);
    });

    await this.writePacket(packet);
    const responseBuffer = await responsePromise;

    console.log(
      `Radiacode ${dataName}: received ${responseBuffer.size()} bytes`
    );
    return responseBuffer;
  }
}
