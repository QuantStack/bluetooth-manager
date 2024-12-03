import { DeviceConfiguration } from './moveHub/hub/hubAsync';
import {
  defaultConfiguration,
  controlData,
  deviceInfo
} from './moveHubSpecific';
import { HubAsync } from './moveHub/hub/hubAsync';
import { HubControl } from './moveHub/ai/hub-control';

export async function readValue(
  service: BluetoothRemoteGATTService,
  characteristicUUID: BluetoothCharacteristicUUID
) {
  try {
    // Get the chosen Characteristic
    const characteristic = await service.getCharacteristic(characteristicUUID);

    // Read the value of the characteristic
    const value = await characteristic.readValue();
    console.log('value length', value.byteLength);

    // The value is a DataView, so we need to extract the first byte, which is the battery level
    //const characteristicValue = value.getUint8(1);

    for (let i = 0; i < value.byteLength; i++) {
      console.log(i);
      console.log(value.getUint8(i));
    }

    //console.log(`Value: ${characteristicValue}%`);
  } catch (error) {
    console.log('Error reading the value of the characteristic:', error);
  }
}

export async function getServicesFromDevice(
  device: BluetoothDevice
): Promise<Array<BluetoothRemoteGATTService> | undefined> {
  const server = await device.gatt?.connect();
  const services = await server?.getPrimaryServices(); // Get all services exposed by the device
  return services;
}

export default class ConnectedDevice {
  public deviceID: string;
  public deviceName: string | undefined;
  public isConnected: boolean | undefined;
  public bluetoothDevice: BluetoothDevice;

  async connect(bluetoothDevice: BluetoothDevice): Promise<BluetoothDevice> {
    this.bluetoothDevice = bluetoothDevice;
    this.bluetoothDevice.addEventListener(
      'gattserverdisconnected',
      async event => {
        console.warn('Device got disconnected');
      }
    );
    this.isConnected = true;
    return this.bluetoothDevice;
  }

  async disconnect(): Promise<boolean> {
    console.warn('Disconnect is called!');
    if (this.bluetoothDevice) {
      this.bluetoothDevice.gatt?.disconnect();
      this.isConnected = false;
      return true;
    }
    this.isConnected = true;
    return false;
  }
  async getServices() {
    const services = await getServicesFromDevice(this.bluetoothDevice); // Await services directly
    console.log('Services fetched:', services);

    if (!services || services.length === 0) {
      throw new Error('No services found on the device.');
    }
  }
}

export class MoveHub extends ConnectedDevice {
  public configuration: DeviceConfiguration;
  public hub: HubAsync;

  logDebug(message?: any, ...optionalParams: any[]): void {
    if (message) {
      //console.warn(message);
    } else return;
  }

  async initDevice(): Promise<MoveHub> {
    console.log('We are in initDevice of Move Hub class');
    try {
      const services = await getServicesFromDevice(this.bluetoothDevice); // Await services directly
      console.log('Services fetched:', services);

      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      }
      console.log('Services fetched:', services);
      for (const service of services) {
        if (service.uuid === '00001623-1212-efde-1623-785feabcd123') {
          const characteristics = await service.getCharacteristic(
            '00001624-1212-efde-1623-785feabcd123'
          );
          if (!characteristics) {
            throw new Error(
              'Characteristics not found for the specified service.'
            );
          }
          console.log('Characteristics fetched:', characteristics);
          // Initialize hub
          this.hub = new HubAsync(characteristics, defaultConfiguration);
          this.hub.logDebug = this.logDebug;

          // Register events
          // Ensure hub is fully configured before returning
          await new Promise(resolve => {
            this.hub.emitter.on('connect', () => {
              this.hub.afterInitialization();
              const hubControl = new HubControl(
                deviceInfo,
                controlData,
                defaultConfiguration
              );
              hubControl.start(this.hub);

              setInterval(() => {
                hubControl.update();
              }, 100);

              resolve(true); // Resolve only after hub is fully initialized
            });
          });
          break;
        }
      }

      return this;
    } catch (error) {
      console.error('Error during device initialization:', error);
      throw error; // Propagate the error for the caller to handle
    }
  }
}

export class SmartWatch extends ConnectedDevice {
  async initDevice() {
    console.log('We are in initDevice of Smart Watch class');
    try {
      const services = await getServicesFromDevice(this.bluetoothDevice); // Await services directly
      console.log('Services fetched:', services);

      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      }
      console.log('Services fetched:', services);
      for (const service of services) {
        if (service.uuid === '6a4e2401-667b-11e3-949a-0800200c9a66') {
          const characteristics = await service.getCharacteristics();
          console.log('characteristics:', characteristics);
          if (!characteristics) {
            throw new Error(
              'Characteristics not found for the specified service.'
            );
          }
          console.log('Characteristics fetched:', characteristics);

          break;
        }
      }

      return this;
    } catch (error) {
      console.error('Error during device initialization:', error);
      throw error; // Propagate the error for the caller to handle
    }
  }
}

export class LightBulb extends ConnectedDevice {
  async turnOff(characteristic: BluetoothRemoteGATTCharacteristic) {
    const turnOffCommand = new Uint8Array([0xa1, 0x00]); // 0xA1 could be a header
    characteristic
      .writeValue(turnOffCommand)
      .then(() => {
        console.log(`Light turned off successfully for characteristics ${characteristic.uuid}!`);
      })
      .catch(error => {
        console.error('Error turning off the light:', error);
      });
  }
  async initDevice() {
    try {
      const services = await getServicesFromDevice(this.bluetoothDevice); // Await services directly
      console.log('Services fetched:', services);

      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      }
      //console.log('Services fetched:', services);
      for (const service of services) {
        const characteristicsList = await service.getCharacteristics();
        console.log('characteristics:', characteristicsList);
        characteristicsList.forEach(async characteristics => {
        
            this.turnOff(characteristics);
            
         
        });

        if (!characteristicsList) {
          throw new Error(
            'Characteristics not found for the specified service.'
          );
        }
        console.log('Characteristics fetched:', characteristicsList);

        break;
      }
      /*}*/

      return this;
    } catch (error) {
      console.error('Error during device initialization:', error);
      throw error; // Propagate the error for the caller to handle
    }
  }
}

export class Loudspeaker extends ConnectedDevice {
  async initDevice() {
    try {
      const services = await getServicesFromDevice(this.bluetoothDevice); // Await services directly
      console.log('Services fetched:', services);

      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      }
      //console.log('Services fetched:', services);
      for (const service of services) {
        /*if (
        service.uuid === '0000fff6-0000-1000-8000-00805f9b34fb'
      ) {*/
        console.log('service:', service);
        const characteristicsList = await service.getCharacteristics();
        console.log('characteristics:', characteristicsList);
        characteristicsList.forEach(async characteristics => {
          console.log('Characteristics uuid:', characteristics.uuid);
        });

        if (!characteristicsList) {
          throw new Error(
            'Characteristics not found for the specified service.'
          );
        }
        console.log('Characteristics fetched:', characteristicsList);

        break;
      }
      /*}*/

      return this;
    } catch (error) {
      console.error('Error during device initialization:', error);
      throw error; // Propagate the error for the caller to handle
    }
  }
}
