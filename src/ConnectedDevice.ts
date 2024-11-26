import { Service } from './services';
import { servicesDict } from './services';
import { DeviceConfiguration } from './moveHub/hub/hubAsync';
import {
  defaultConfiguration,
  controlData,
  deviceInfo
} from './moveHubSpecific';
import { HubAsync } from './moveHub/hub/hubAsync';
import { HubControl } from './moveHub/ai/hub-control';

const optionalServices = getServicesFromDict(servicesDict);

export function getServicesFromDict(servicesDict: Record<string, Service>) {
  const serviceUUIDs = Object.values(servicesDict).map(
    (service: Service) => service.serviceUUID
  );
  return serviceUUIDs;
}
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

export async function connectToAllServices(
  services: Array<BluetoothRemoteGATTService>
) {
  console.log('List of services:', services);
  services?.forEach(service => {
    this.connectToSelectedService(service);
  });
}

export function connectToSelectedService(service: BluetoothRemoteGATTService) {
  if (service.uuid === '00001801-0000-1000-8000-00805f9b34fb') {
    console.log('Generic Access Service :', service.uuid);
    service.getCharacteristics().then(list => {
      console.log('List of available characteristics:', list);
      list.forEach(item => {
        console.log('characteristics UUID', item.uuid);
        console.log('characteristics properties', item.properties);
      });
    });
  }

  if (service.uuid === '0000180f-0000-1000-8000-00805f9b34fb') {
    console.log('Battery level service :', service.uuid);
    service.getCharacteristics().then(list => {
      console.log('List of available characteristics:', list);
      list.forEach(item => {
        readValue(service, item.uuid);
      });
    });
  }

  if (service.uuid === '0000fe0f-0000-1000-8000-00805f9b34fb') {
    console.log('Bluetooth Device Information :', service.uuid);
    service.getCharacteristics().then(list => {
      console.log('List of available characteristics:', list);
      list.forEach(item => {
        console.log('item UUID', item.uuid);
        readValue(service, item.uuid);
      });
    });
  }

  if (service.uuid === '0000180d-0000-1000-8000-00805f9b34fb') {
    console.log('Heart rate service :', service.uuid);
    service
      ?.getCharacteristic('00002a37-0000-1000-8000-00805f9b34fb')
      .then(heartRate => {
        heartRate.addEventListener(
          'characteristicvaluechanged',
          handleRateChange
        );
      });
  }
  if (service.uuid === '6a4e2401-667b-11e3-949a-0800200c9a66') {
    console.log('Unknown service for Smart Watch :', service.uuid);
    service.getCharacteristics().then(list => {
      console.log('List of available characteristics:', list);
      list.forEach(item => {
        //readValue(service, item.uuid);
      });
    });
  } else if (service.uuid === '00001623-1212-efde-1623-785feabcd123') {
    console.log('Move hub service:', service.uuid);
    service.getCharacteristics().then(list => {
      console.log('List of available characteristics:', list);
      list.forEach(item => {
        if (item.uuid === '00001624-1212-efde-1623-785feabcd123') {
        }
      });
    });
  }
}

export function getSelectedService(
  selectedServiceUUID: string,
  service: BluetoothRemoteGATTService
): BluetoothRemoteGATTService | undefined {
  if (selectedServiceUUID === service.uuid) {
    return service;
  }
}

/*async reconnect(device: BluetoothDevice, isConnected: boolean): Promise<
    [boolean, BluetoothRemoteGATTCharacteristic | undefined]
  > {
    console.warn('Reconnect is called!');
    if (device) {
      const bluetooth = await getCharacteristic(device, serviceUUID, characteristicUUID);
      isConnected = true;
      return [true, bluetooth];
    }
    isConnected = false;
    return [false, undefined];
  }*/

export default class ConnectedDevice {
  public deviceID: string;
  public deviceName: string | undefined;
  public isConnected: boolean | undefined;
  public bluetoothDevice: BluetoothDevice;
  public configuration: DeviceConfiguration;
  public hub: HubAsync;

  async connect(): Promise<BluetoothDevice> {
    const options = {
      acceptAllDevices: true,
      optionalServices: optionalServices
    };

    this.bluetoothDevice = await navigator.bluetooth.requestDevice(options);
    console.log(this.bluetoothDevice);
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
  logDebug(message?: any, ...optionalParams: any[]): void {
    if (message) {
      //console.warn(message);
    } else return;
  }
  async initDevice(): Promise<void> {
    const services = getServicesFromDevice(this.bluetoothDevice);
    await services.then((services: Array<BluetoothRemoteGATTService>) => {
      services.forEach((service: BluetoothRemoteGATTService) => {
        if (service.uuid === '00001623-1212-efde-1623-785feabcd123') {
          service
            .getCharacteristic('00001624-1212-efde-1623-785feabcd123')
            .then(characteristics => {
              this.hub = new HubAsync(characteristics, defaultConfiguration);
              this.hub.logDebug = this.logDebug;
              this.hub.emitter.on('disconnect', async evt => {});

              this.hub.emitter.on('connect', async evt => {
                this.hub.afterInitialization();
                await this.hub.ledAsync('white');
                this.hub.logDebug('Connected');
              });

              const hubControl = new HubControl(
                deviceInfo,
                controlData,
                defaultConfiguration
              );
              hubControl.start(this.hub);

              setInterval(() => {
                hubControl.update();
              }, 100);
            });
        }
      });
    });
  }
}


export class MoveHubDevice extends ConnectedDevice {


  // see how we can implement it
}
