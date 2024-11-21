import { JupyterFrontEnd } from '@jupyterlab/application';
import { connect, disconnect } from './device';
import { Signal } from '@lumino/signaling';
/**
 * A class used to consolidate the signals used to rerender the connected devices section.
 */
export class ConnectedDevicesSignaler {
  constructor(devicesList: Array<BluetoothDevice>) {
    this._devicesList = devicesList;
    this.devicesListChanged = new Signal<this, Array<any>>(this);
  }

  get devicesList(): Array<any> {
    return this._devicesList;
  }

  async connectDevice(app: JupyterFrontEnd): Promise<void> {
    connect().then(device => {
      if (!this._devicesList.includes(device) && device.id) {
        this.addDeviceToList(device);
      }
    });
  }
  async disconnectDevice(device: BluetoothDevice, isConnected: boolean) {
    disconnect(device, isConnected);
    this.removeDeviceFromList(device);
  }

  // Method to add an item to the list
  addDeviceToList(item: BluetoothDevice): void {
    this._devicesList.push(item);
    // Emit the signal when the list changes

    this.devicesListChanged.emit(this._devicesList);
    console.warn(
      `A device is added and the list has ${this._devicesList.length} devices`
    );
  }

  // Method to remove an item from the list
  removeDeviceFromList(item: BluetoothDevice): void {
    console.log('before removing, the list of devices is:', this._devicesList);
    const index = this._devicesList.indexOf(item);
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
      console.log(`device n°${index + 1} with deviceID ${device.id}`);
      disconnect(device, false);
      this.removeDeviceFromList(device);
      this.devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<BluetoothDevice>;
  public devicesListChanged;
}
