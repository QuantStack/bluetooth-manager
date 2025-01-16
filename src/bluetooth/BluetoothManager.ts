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
  ): Promise<BluetoothManager.Device> {
    const native = await this.requestDevice(registryItem);
    const device = await registryItem.factory(native!);
    if (device?.isConnected) {
      const identifier = buildIdentifier(device.native);
      this.addDeviceToList(device!);
   
      device!.OnConnectionChanged.connect(
        async (sender, isConnected: boolean) => {
          if (isConnected === false) {
            console.warn(
              `The connection state for device identified as ${identifier} has changed and it is now set to false: ${isConnected}`,
            
            );
            this.removeDeviceFromList(device!);
          }
        }
      )
    }

    return device!;
  }

  async disconnectDevice(device: BluetoothManager.Device) {
    
    const isDisconnected = await device.disconnect();
    if (isDisconnected){
      this.removeDeviceFromList(device)
    }
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
      console.error('No bluetooth device could be requested ' + error);
      return undefined;
    }
  }
  private _deviceList: Array<BluetoothManager.Device>;
  public deviceListChanged: Signal<this, Array<BluetoothManager.Device>>;
  public registeredByAPlugin: Signal<
    BluetoothManager,
    BluetoothManager.DeviceRegistry
  >;
  //public disconnectedADevice: Signal<this, string>;
  private _registry: BluetoothManager.DeviceRegistry;
  public identifierRegistry: Array<string>;
}

export namespace BluetoothManager {
  export class Device {
    public isConnected: boolean | undefined;
    public native: BluetoothDevice;
    public OnConnectionChanged: Signal<this, boolean>;

    constructor(native: BluetoothDevice) {
      this.OnConnectionChanged = new Signal<this, boolean>(this);
      this.isConnected = false;
      this.native = native;
    }

    async connectAndGetAllServices(
      native: BluetoothDevice
    ): Promise<Array<BluetoothRemoteGATTService>> {
      this.native.addEventListener('gattserverdisconnected', event => {
        this.isConnected = false;
        this.OnConnectionChanged.emit(this.isConnected);
      });

      await this.native.gatt?.connect();
      this.isConnected = true;
      this.OnConnectionChanged.emit(this.isConnected);
      const services = await native.gatt?.getPrimaryServices(); // Get all services exposed by the device

      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      } else return services;
    }

    async getService(
      native: BluetoothDevice,
      selectedServiceUUID: string
    ): Promise<BluetoothRemoteGATTService | undefined> {
      const services = await this.connectAndGetAllServices(native);
      const selectedService = services.find(
        service => service.uuid === selectedServiceUUID
      );
      if (selectedService) {
        return selectedService;
      } else {
        return;
      }
    }

    async getAllCharacteristics(
      native: BluetoothDevice,
      serviceUUID: string
    ): Promise<Array<BluetoothRemoteGATTCharacteristic> | undefined> {
      const service = await this.getService(native, serviceUUID);
      if (service) {
        return service.getCharacteristics();
      } else {
        return;
      }
    }
    async getCharacteristic(
      native: BluetoothDevice,
      serviceUUID: string,
      characteristicUUID: string
    ): Promise<BluetoothRemoteGATTCharacteristic | undefined> {
      const service = await this.getService(native, serviceUUID);
      const characteristic = service?.getCharacteristic(characteristicUUID);
      return characteristic;
    }

    async disconnect(): Promise<boolean> {
      if (this.native) {
        this.native.gatt?.disconnect();
        this.isConnected = false;
        this.OnConnectionChanged.emit(this.isConnected);
        return true;
      }
      this.isConnected = true;
      return false;
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
