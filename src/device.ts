import { defaultConfiguration, initHub } from './moveHubSpecific';
import { servicesDict } from './services';

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

export function connectToSelectedService(
  service: BluetoothRemoteGATTService,
  servicesDict: any
) {
  console.log('services Dict:', servicesDict);
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
          initHub(item, defaultConfiguration).then(hub => {
            hub.emitter.on('color', () => {
              hub.ledAsync('orange');
            });

            /*hub.emitter.on('distance', () => {
              hub.drive(10);
            });*/
          });
        }
      });
    });
  }
}

export async function connect(): /*Promise<BluetoothRemoteGATTCharacteristic | undefined> */ Promise<BluetoothDevice> {
  /*disconnectCallback: () => Promise<void>*/

  const options = {
    acceptAllDevices: true,
    optionalServices: [
      '00001801-0000-1000-8000-00805f9b34fb', // Generic attribute service
      '00001800-0000-1000-8000-00805f9b34fb', // Generic access service
      '0000180f-0000-1000-8000-00805f9b34fb', // Battery service
      '00001623-1212-efde-1623-785feabcd123', // Move hub service
      '0000180d-0000-1000-8000-00805f9b34fb', // Heart rate service
      '0000fe0f-0000-1000-8000-00805f9b34fb', // Manufacturer Specific Data Service,
      '6a4e2401-667b-11e3-949a-0800200c9a66' // Unknown service from Smart Watch
    ]
  };
  //let isConnected: boolean | undefined = false;
  const device = await navigator.bluetooth.requestDevice(options);
  console.log(device);
  // if (device) isConnected = true;
  device.addEventListener('gattserverdisconnected', async event => {
    /*await disconnectCallback();*/
    console.warn('device got disconnected');
  });
  const server = await device.gatt?.connect();
  const services = await server?.getPrimaryServices(); // Get all services exposed by the device
  console.log('List of services:', services);
  services?.forEach(service => {
    connectToSelectedService(service, servicesDict);
  });

  await device.watchAdvertisements();
  //console.log(getCharacteristic(device));
  return device;
}

/*export async function reconnect(device: BluetoothDevice, isConnected: boolean): Promise<
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

export function disconnect(
  device: BluetoothDevice,
  isConnected: Boolean
): boolean {
  console.warn('Disconnect is called!');
  if (device) {
    device.gatt?.disconnect();
    isConnected = false;
    return true;
  }
  isConnected = true;
  return false;
}
