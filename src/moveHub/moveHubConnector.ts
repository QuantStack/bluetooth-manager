const MOVE_HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
const MOVE_HUB_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

export class MoveHubConnector {
  public static device: BluetoothDevice;
  public static isWebBluetoothSupported: boolean = navigator.bluetooth ? true : false;
  public static isConnected: boolean | undefined;

  public static async connect(disconnectCallback: () => Promise<void>): Promise<BluetoothRemoteGATTCharacteristic | undefined> {
    const options = {
      acceptAllDevices: false,
      filters: [{ services: [MOVE_HUB_SERVICE_UUID] }],
      optionalServices: [MOVE_HUB_SERVICE_UUID],
    };
    this.isConnected = false;
    this.device = await navigator.bluetooth.requestDevice(options);
    if (this.device) 
      this.isConnected = true;
    this.device.addEventListener('gattserverdisconnected', async event => {
      await disconnectCallback();
    });

    await this.device.watchAdvertisements();

    // this.device.addEventListener('advertisementreceived', event => {
    //   // @ts-ignore
    //   console.log(event.rssi);
    // });

    return MoveHubConnector.getCharacteristic(this.device);
  }

  private static async getCharacteristic(device: BluetoothDevice): Promise<BluetoothRemoteGATTCharacteristic | undefined> {
    const server = await device.gatt?.connect();
    const service = await server?.getPrimaryService(MOVE_HUB_SERVICE_UUID);
    return await service?.getCharacteristic(MOVE_HUB_CHARACTERISTIC_UUID);
  }

  public static async reconnect(): Promise<[boolean, BluetoothRemoteGATTCharacteristic| undefined]> {
    console.log('Reconnect is called!');
    if (this.device) {
      const bluetooth = await MoveHubConnector.getCharacteristic(this.device);
      this.isConnected = true;
      return [true, bluetooth];
    }
    this.isConnected = false;
    console.log(this.isConnected);
    return [false, undefined];
  }

  public static disconnect(): boolean {
    console.log('Disconnect is called!');
    if (this.device) {
      this.device.gatt?.disconnect();
      this.isConnected = false;
      return true;
    }
    this.isConnected = true;
    console.log(this.isConnected);
    return false;
  }

  public static async getDeviceID(device: BluetoothDevice): Promise<string> {
    return device.id;
  }

  public static async getDeviceName(device: BluetoothDevice): Promise<string | undefined> {
    return device.name;
  }

  public static async getConnectionState(): Promise<boolean | undefined> {
    return this.isConnected;
  }
}
