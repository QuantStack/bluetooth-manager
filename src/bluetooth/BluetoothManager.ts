import { Signal } from '@lumino/signaling';
import { Token } from '@lumino/coreutils';
import { IDeviceOptions } from './DeviceOptions';
import { buildCompleteIdentifier } from '../bluetooth-extension';
import { IDisposable } from '@lumino/disposable';
import { Dialog, showDialog } from '@jupyterlab/apputils';


/**
 * A class used to update the list of connected device and the related signals used to rerender the connected devices section.
 */
export class BluetoothManager implements IBluetoothManager {
  constructor() {
    this.deviceListChanged = new Signal<this, Array<BluetoothManager.Device>>(
      this
    );
    this.registeredByAPlugin = new Signal<
      this,
      BluetoothManager.DeviceRegistry
    >(this);
    this._registry = new BluetoothManager.DeviceRegistry();
    this._deviceList = [];
    this._identifierRegistry = [];
  }

  get deviceList(): Array<BluetoothManager.Device> {
    return this._deviceList;
  }

  get registry(): BluetoothManager.DeviceRegistry {
    return this._registry;
  }

  get identifierRegistry(): Array<string> {
    return this._identifierRegistry;
  }

  async connectDevice(
    registryItem: IDeviceRegistryItem
  ): Promise<BluetoothManager.Device | undefined> {
    const native = await this.requestDevice(registryItem);
    if (native) {
      const device = await registryItem.factory(native);
      if (device && device.isConnected) {
        this.addDeviceToList(device);
        device.disconnected.connect(async () => {
          this.removeDeviceFromList(device);
        });
        return device;
      }
    }
  }

  async disconnectDevice(device: BluetoothManager.Device) {
    await device.disconnect();
    device.dispose();
  }

  // Method to add a device to the list
  addDeviceToList(device: BluetoothManager.Device): void {
    const identifier = buildCompleteIdentifier(device.native);
    if (this.identifierRegistry.includes(identifier) === false) {
      this._deviceList.push(device);
      this.identifierRegistry.push(identifier);
    } else {
      console.warn('The device is already in the identifierRegistry');
    }
    // Emit the signal when the list changes
    this.deviceListChanged.emit(this._deviceList);
  }

  // Method to remove a device from the list
  removeDeviceFromList(device: BluetoothManager.Device): void {
    const index = this._deviceList.indexOf(device);
    if (index > -1) {
      this._deviceList.splice(index, 1);
      this.identifierRegistry.splice(index, 1);
      // Emit the signal when the list changes
      this.deviceListChanged.emit(this._deviceList);
    }
    device.dispose();
  }

  removeAllDevices() {
    this._deviceList.forEach((device, index) => {
      this.removeDeviceFromList(device);
      this.deviceListChanged.emit(this._deviceList);
    });
  }

  register(registryItem: IDeviceRegistryItem) {
    this._registry.add(registryItem);
    this.registeredByAPlugin.emit(this._registry);
    console.warn(
      `New item from category ${registryItem.deviceType} is added to the registry.`
    );
    return this._registry;
  }

  async checkWebBluetoothSupport(): Promise<boolean> {
    const isWebBluetoothSupported: boolean = navigator.bluetooth ? true : false;
    if (isWebBluetoothSupported === false) {
      showDialog({
        title: ('Error'),
        body: (
          'Web Bluetooth is not supported on your browser. It works on Chrome and Edge (Firefox and Explorer are not supported). \n Please also check that the Web Bluetooth flag is properly set to enabled in the Chrome flags (chrome://flags/).'
        ),
        buttons: [
          Dialog.okButton({ label: ('Close') })
        ]
      });
    }
    return isWebBluetoothSupported
  }

  async requestDevice(
    registryItem: IDeviceRegistryItem
  ): Promise<BluetoothDevice | undefined> {
    const isWebBluetoothSupported = await this.checkWebBluetoothSupport()
    if (isWebBluetoothSupported) {
      const native = await navigator.bluetooth.requestDevice(
        registryItem.options
      );
      return native;
    }
    else {
      return;
    }
  }

  private _deviceList: Array<BluetoothManager.Device>;
  public deviceListChanged: Signal<this, Array<BluetoothManager.Device>>;
  public registeredByAPlugin: Signal<
    BluetoothManager,
    BluetoothManager.DeviceRegistry
  >;
  private _registry: BluetoothManager.DeviceRegistry;
  private _identifierRegistry: Array<string>;
}

export namespace BluetoothManager {
  /* A class for device using the native bluetoothDevice from the web bluetooth API*/
  export class Device implements IDisposable {
    public isConnected: boolean | undefined;
    public native: BluetoothDevice;
    public connected: Signal<this, boolean>;
    public disconnected: Signal<this, boolean>;
    public isDisposed: boolean;
    public contextCommands:Array<string>;

    constructor(native: BluetoothDevice) {
      this.connected = new Signal<this, boolean>(this);
      this.disconnected = new Signal<this, boolean>(this);
      this.isConnected = false;
      this.isDisposed = false;
      this.native = native;
      this.contextCommands = ['bluetooth-manager:disconnect-device', 'bluetooth-manager:add-lego-movehub-control-panel']
    }

    async connectAndGetAllServices(): Promise<
      Array<BluetoothRemoteGATTService> | undefined
    > {
      this.native.addEventListener('gattserverdisconnected', event => {
        this.isConnected = false;
        this.disconnected.emit(true);
      });
      const server = this.native.gatt
      if (server) {
        const timeout = 5000;
        const connectWithTimeout = new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(
              new Error('Connection to GATT server timed out'));
            server.disconnect();
            this.dispose();
          }, timeout);

          server.connect().then(async () => {
            clearTimeout(timeoutId);
            resolve();
            this.isConnected = true;
            this.connected.emit(true);
          })
            .catch((error) => {
              server.disconnect();
              reject(error);
            });
        });
        await connectWithTimeout
        if (server.connected === true) {
          const services = await server.getPrimaryServices();
          if (!services || services.length === 0) {
            throw new Error('Server exists but no service found on the device.');
          } else { return services; }
        }
        else {
          throw new Error('There is no connection to server. No attempt to get a service.')
        }
      }
      else {
        throw new Error('Server is not defined.');
      }
    }

    /*async connectAndGetAllServices(): Promise<
      Array<BluetoothRemoteGATTService> | undefined
    > {
      this.native.addEventListener('gattserverdisconnected', event => {
        this.isConnected = false;
        this.disconnected.emit(true);
      });
      const server = this.native.gatt
      if (server) {
        server.connect();
        if (server.connected === true) {
          const services = await server.getPrimaryServices();
          this.isConnected = true;
          if (!services || services.length === 0) {
            throw new Error('Server exists but no service found on the device.');
          } else { return services; }
        }
        else {
          throw new Error('There is no connection to server. No attempt to get a service.')
        }
      }
      else {
        throw new Error('Server is not defined.');
      }
    }*/

    async disconnect(): Promise<void> {
      if (this.native) {
        this.native.gatt?.disconnect();
        this.isConnected = false;
      }
    }

    async getService(
      selectedServiceUUID: string
    ): Promise<BluetoothRemoteGATTService | undefined> {
      const services = await this.connectAndGetAllServices();
      if (services) {
        const selectedService = services.find(
          service => service.uuid === selectedServiceUUID
        );
        return selectedService;
      } else {
        throw new Error('Services could not be reached.');
      }
    }

    async getAllCharacteristics(
      serviceUUID: string
    ): Promise<Array<BluetoothRemoteGATTCharacteristic> | undefined> {
      const service = await this.getService(serviceUUID);
      if (service) {
        return service.getCharacteristics();
      } else {
        throw new Error('The requested service is not available.')
      }
    }

    async getCharacteristic(
      serviceUUID: string,
      characteristicUUID: string
    ): Promise<BluetoothRemoteGATTCharacteristic | undefined> {
      const service = await this.getService(serviceUUID);
      if (service) {
        return service.getCharacteristic(characteristicUUID);

      } else {
        throw new Error('The requested service is not available.');
      }
    }

    dispose(): void {
      if (this.isDisposed) {
        return;
      }
      this.isDisposed = true;
      Signal.clearData(this);
    }
  }

  export class DeviceRegistry implements IDeviceRegistry {
    private _registry: Array<IDeviceRegistryItem>;
    public registryItem: IDeviceRegistryItem;
    constructor() {
      this._registry = [];
    }

    add(registryItem: IDeviceRegistryItem) {
      this._registry.push(registryItem);
    }
    get itemsList(): Array<IDeviceRegistryItem> {
      return this._registry;
    }
  }
}

/**
 * Interface for the bluetooth manager.
 */
export interface IBluetoothManager {
  addDeviceToList(Device: BluetoothManager.Device): void;
  removeDeviceFromList(Device: BluetoothManager.Device): void;
  removeAllDevices(Devices: Array<BluetoothManager.Device>): void;
  register(registryItem: IDeviceRegistryItem): BluetoothManager.DeviceRegistry;
  connectDevice(registryItem: IDeviceRegistryItem): any;
  disconnectDevice(device: BluetoothManager.Device): void;
  deviceListChanged: Signal<BluetoothManager, Array<BluetoothManager.Device>>;
  registeredByAPlugin: Signal<
    BluetoothManager,
    BluetoothManager.DeviceRegistry
  >;
  get deviceList(): Array<BluetoothManager.Device>;
  get registry(): BluetoothManager.DeviceRegistry;
  get identifierRegistry(): Array<string>;
}

export interface IDeviceRegistryItem {
  deviceType: string;
  factory: (
    native: BluetoothDevice
  ) => Promise<BluetoothManager.Device | undefined>;
  options: IDeviceOptions;
}

export interface IDeviceRegistry {
  add: (registryItem: IDeviceRegistryItem) => void;
  get itemsList(): Array<IDeviceRegistryItem>;
}

export const IBluetoothManager = new Token<IBluetoothManager>(
  '@jupyterlab/bluetooth:manager'
);
