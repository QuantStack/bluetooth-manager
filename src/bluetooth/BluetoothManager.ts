//import { JupyterFrontEnd } from '@jupyterlab/application';
import { Signal } from '@lumino/signaling';
//import { Service, servicesDict } from '../services';
//import { IDisposable } from '@lumino/disposable';
import { Token } from '@lumino/coreutils';

/**
 * A class used to update the list of connected device and related signals used to rerender the connected devices section.
 */
export class BluetoothManager implements IBluetoothManager {
  constructor(devicesList: Array<BluetoothManager.Device>) {
    this._devicesList = devicesList;
    this.devicesListChanged = new Signal<this, Array<BluetoothManager.Device>>(
      this
    );
    this.connectedADevice = new Signal<this, BluetoothManager.Device>(this);
    this.registry = new BluetoothManager.DeviceRegistry();
  }

  get devicesList(): Array<BluetoothManager.Device> {
    return this._devicesList;
  }

  async connectDevice(identifier: string): Promise<BluetoothManager.Device> {
    return await new BluetoothManager.Device();
  }

  async disconnectDevice(device: BluetoothManager.Device): Promise<void> {
    device.disconnect();
    this.removeDeviceFromList(device);
  }

  // Method to add an item to the list
  addDeviceToList(device: BluetoothManager.Device): void {
    this._devicesList.push(device);
    // Emit the signal when the list changes

    this.devicesListChanged.emit(this._devicesList);
    console.warn(
      `A device is added and the list has ${this._devicesList.length} devices`
    );
  }

  // Method to remove an item from the list
  removeDeviceFromList(device: BluetoothManager.Device): void {
    console.log('Before removing, the list of devices is:', this._devicesList);
    const index = this._devicesList.indexOf(device);
    if (index > -1) {
      this._devicesList.splice(index, 1);
      // Emit the signal when the list changes
      this.devicesListChanged.emit(this._devicesList);
    }
    console.warn(
      `A device is removed and the list has ${this._devicesList.length} devices`
    );
    console.warn('After removing, the list of devices is:', this._devicesList);
  }

  removeAllDevices() {
    this._devicesList.forEach((device, index) => {
      console.log(`device n°${index + 1} with deviceID ${device.native.id}`);
      device.disconnect();
      this.removeDeviceFromList(device);
      this.devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<BluetoothManager.Device>;
  public devicesListChanged: Signal<this, Array<BluetoothManager.Device>>;
  public connectedADevice: Signal<this, BluetoothManager.Device>;
  //public disconnectedADevice: Signal<this, string>;
  public registry: BluetoothManager.DeviceRegistry;
}

export namespace BluetoothManager {
  export class Device /*implements IDisposable*/ {
    /*isDisposed: boolean;
    dispose(): void {}*/
    public isConnected: boolean | undefined;
    public native: BluetoothDevice;

    async connect(bluetoothDevice: BluetoothDevice): Promise<BluetoothDevice> {
      this.native = bluetoothDevice;
      this.native.addEventListener('gattserverdisconnected', async event => {
        console.warn('Device got disconnected');
      });
      this.isConnected = true;
      return this.native;
    }

    async disconnect(): Promise<boolean> {
      console.warn('Disconnect is called!');
      if (this.native) {
        this.native.gatt?.disconnect();
        this.isConnected = false;
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

    add(item: IDeviceRegistryItem) {
      this._registry.push(item);
    }
    get registry(): Array<IDeviceRegistryItem> {
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
  connectDevice(identifier: string): Promise<BluetoothManager.Device>;
  disconnectDevice(Device: BluetoothManager.Device): Promise<void>;
  devicesListChanged: Signal<BluetoothManager, Array<BluetoothManager.Device>>;
  connectedADevice: Signal<BluetoothManager, BluetoothManager.Device>;
  //get disconnectedADevice(): Signal<BluetoothManager, string>;
  get devicesList(): Array<BluetoothManager.Device>;
  get registry(): BluetoothManager.DeviceRegistry;
}

export interface IDeviceRegistryItem {
  identifier: string;
  factory: () => BluetoothManager.Device;
  filters: string[];
}

export interface IDeviceRegistry {
  add: (item: IDeviceRegistryItem) => void;
  get registry(): Array<IDeviceRegistryItem>;
}

export const IBluetoothManager = new Token<IBluetoothManager>(
  '@jupyterlab/bluetooth:manager'
);
