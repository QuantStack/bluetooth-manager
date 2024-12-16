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
  }

  get devicesList(): Array<BluetoothManager.Device> {
    return this._devicesList;
  }

  get devicesRegistry(): any {
    return this._devicesRegistry;
  }

  get connectedADevice(): Signal<this, BluetoothManager.Device> {
    return this._connectedADevice;
  }
  /*get disconnectedADevice(): Signal<this, string> {
    return this._disconnectedADevice;
  }*/

  get devicesListChanged(): Signal<this, Array<BluetoothManager.Device>> {
    console.log('the list has changed')
    return this._devicesListChanged;
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
      this._devicesListChanged.emit(this._devicesList);
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
      this._devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<BluetoothManager.Device>;
  private _devicesListChanged: Signal<this, Array<BluetoothManager.Device>>;
  private _connectedADevice: Signal<this, BluetoothManager.Device>;
  //private _disconnectedADevice: Signal<this, string>;
  private _devicesRegistry: any;
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

    constructor(registry: Array<IDeviceRegistryItem>) {
      this._registry = registry;
    }

    add(item: IDeviceRegistryItem) {
      this._registry.push(item);
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
  get devicesListChanged(): Signal<
    BluetoothManager,
    Array<BluetoothManager.Device>
  >;
  get connectedADevice(): Signal<BluetoothManager, BluetoothManager.Device>;
  //get disconnectedADevice(): Signal<BluetoothManager, string>;
  get devicesList(): Array<BluetoothManager.Device>;
  get devicesRegistry(): any;
}

export interface IDeviceRegistry {
  add: (item: IDeviceRegistryItem) => void;
}

export interface IDeviceRegistryItem {
  identifier: string;
  factory: () => BluetoothManager.Device;
  filters: string[];
}

export const IBluetoothManager = new Token<IBluetoothManager>(
  '@jupyterlab/bluetooth:manager'
);
