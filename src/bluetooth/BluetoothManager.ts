import { Signal } from '@lumino/signaling';
import { Token } from '@lumino/coreutils';
import { DeviceOptions } from './DeviceOptions';
import { buildIdentifier } from '../bluetooth-extension';

/**
 * A class used to update the list of connected device and related signals used to rerender the connected devices section.
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
    this.identifierRegistry = [];
  }

  get deviceList(): Array<BluetoothManager.Device> {
    return this._deviceList;
  }

  get registry(): BluetoothManager.DeviceRegistry {
    return this._registry;
  }
  async connectDevice(
    registryItem: IDeviceRegistryItem
  ): Promise<BluetoothManager.Device | undefined> {
    const native = await this.requestDevice(registryItem);
    if (native) {
      const device = await registryItem.factory(native);
      if (device && device.isConnected) {
        this.addDeviceToList(device!);

        device.OnDisconnected.connect(async () => {
          this.removeDeviceFromList(device);
        });

        return device;
      }
    }
  }

  async disconnectDevice(device: BluetoothManager.Device) {
    await device.disconnect();
  }

  // Method to add an item to the list
  addDeviceToList(device: BluetoothManager.Device): void {
    const identifier = buildIdentifier(device.native);
    if (!(identifier in this.identifierRegistry)) {
      this._deviceList.push(device);
      this.identifierRegistry.push(identifier);
    } else {
      console.warn('The device is already in the identifierRegistry');
    }
    // Emit the signal when the list changes
    this.deviceListChanged.emit(this._deviceList);
  }

  // Method to remove an item from the list
  removeDeviceFromList(device: BluetoothManager.Device): void {
    console.warn('removeDeviceFromList is called!', device);
    const index = this._deviceList.indexOf(device);
    if (index > -1) {
      this._deviceList.splice(index, 1);
      this.identifierRegistry.splice(index, 1);
      // Emit the signal when the list changes
      this.deviceListChanged.emit(this._deviceList);
    }
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
      `New item from category ${registryItem.identifier} is added to the registry.`
    );
    return this._registry;
  }

  async requestDevice(
    registryItem: IDeviceRegistryItem
  ): Promise<BluetoothDevice | undefined> {
    try {
      const native = await navigator.bluetooth.requestDevice(
        registryItem.options
      );
      return native;
    } catch (error) {
      console.error(error);
    }
  }
  private _deviceList: Array<BluetoothManager.Device>;
  public deviceListChanged: Signal<this, Array<BluetoothManager.Device>>;
  public registeredByAPlugin: Signal<
    BluetoothManager,
    BluetoothManager.DeviceRegistry
  >;
  private _registry: BluetoothManager.DeviceRegistry;
  public identifierRegistry: Array<string>;
}

export namespace BluetoothManager {
  export class Device {
    public isConnected: boolean | undefined;
    public native: BluetoothDevice;
    public OnConnected: Signal<this, boolean>;
    public OnDisconnected: Signal<this, boolean>;

    constructor(native: BluetoothDevice) {
      this.OnConnected = new Signal<this, boolean>(this);
      this.OnDisconnected = new Signal<this, boolean>(this);
      this.isConnected = false;
      this.native = native;
    }

    async connectAndGetAllServices(): Promise<
      Array<BluetoothRemoteGATTService> | undefined
    > {
      this.native.addEventListener('gattserverdisconnected', event => {
        this.isConnected = false;
        this.OnDisconnected.emit(true);
      });

      await this.native.gatt?.connect();
      this.isConnected = true;
      this.OnConnected.emit(true);
      const services = await this.native.gatt?.getPrimaryServices();
      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      } else return services;
    }

    async disconnect(): Promise<void> {
      if (this.native) {
        this.native.gatt?.disconnect();
        this.isConnected = false;
      }
      //this.isConnected = true;
    }

    async getService(
      selectedServiceUUID: string
    ): Promise<BluetoothRemoteGATTService | undefined> {
      try {
        const services = await this.connectAndGetAllServices();
        if (services) {
          const selectedService = services.find(
            service => service.uuid === selectedServiceUUID
          );
          return selectedService;
        } else {
          console.error('Services could not be reached.');
        }
      } catch (error) {
        console.error('The selected service could not be found', error);
      }
    }

    async getAllCharacteristics(
      serviceUUID: string
    ): Promise<Array<BluetoothRemoteGATTCharacteristic> | undefined> {
      try {
        const service = await this.getService(serviceUUID);
        if (service) {
          return service.getCharacteristics();
        } else {
          console.error('The requested service is not available.');
        }
      } catch (error) {
        console.error(
          'There is no available characteristics on the requested service.',
          error
        );
      }
    }

    async getCharacteristic(
      serviceUUID: string,
      characteristicUUID: string
    ): Promise<BluetoothRemoteGATTCharacteristic | undefined> {
      try {
        const service = await this.getService(serviceUUID);
        if (service) {
          return service.getCharacteristic(characteristicUUID);
        } else {
          console.error('The requested service is not available.');
        }
      } catch (error) {
        console.error('The requested characteristic is not available.', error);
      }
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
 * The interface for the bluetooth manager.
 */
export interface IBluetoothManager /*extends IDisposable*/ {
  addDeviceToList(Device: BluetoothManager.Device): void;
  removeDeviceFromList(Device: BluetoothManager.Device): void;
  removeAllDevices(Devices: Array<BluetoothManager.Device>): void;
  register(registryItem: IDeviceRegistryItem): BluetoothManager.DeviceRegistry;
  connectDevice(registryItem: IDeviceRegistryItem): void;
  disconnectDevice(device: BluetoothManager.Device): void;
  deviceListChanged: Signal<BluetoothManager, Array<BluetoothManager.Device>>;
  registeredByAPlugin: Signal<
    BluetoothManager,
    BluetoothManager.DeviceRegistry
  >;
  get deviceList(): Array<BluetoothManager.Device>;
  get registry(): BluetoothManager.DeviceRegistry;
}

export interface IDeviceRegistryItem {
  identifier: string;
  factory: (
    native: BluetoothDevice
  ) => Promise<BluetoothManager.Device | undefined>;
  options: DeviceOptions;
}

export interface IDeviceRegistry {
  add: (registryItem: IDeviceRegistryItem) => void;
  get itemsList(): Array<IDeviceRegistryItem>;
}

export const IBluetoothManager = new Token<IBluetoothManager>(
  '@jupyterlab/bluetooth:manager'
);
