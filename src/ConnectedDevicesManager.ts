import { JupyterFrontEnd } from '@jupyterlab/application';
import ConnectedDevice from './ConnectedDevice';
import { Signal } from '@lumino/signaling';

/**
 * A class used to update the list of connected device and related signals used to rerender the connected devices section.
 */
export class ConnectedDevicesManager {
  constructor(devicesList: Array<ConnectedDevice>) {
    this._devicesList = devicesList;
    this.devicesListChanged = new Signal<this, Array<ConnectedDevice>>(this);
    this.justAddedAMoveHub = new Signal<this, ConnectedDevice>(this);
  }

  get devicesList(): Array<any> {
    return this._devicesList;
  }

  async connectDevice(app: JupyterFrontEnd): Promise<void> {
    const connectedDevice = new ConnectedDevice();
    connectedDevice.connect().then(() => {
      if (
        !this._devicesList.includes(connectedDevice) &&
        connectedDevice.bluetoothDevice.id // check if the device is not already in the list and has an id
      ) {
        this.addDeviceToList(connectedDevice);
        if (connectedDevice.bluetoothDevice.name ==="Move Hub" || connectedDevice.bluetoothDevice.name ==="LEGO Move Hub"){
          console.warn ('The added device is a Move Hub.')
        this.justAddedAMoveHub.emit(connectedDevice);
        }
      }
    });
  }

  async disconnectDevice(connectedDevice: ConnectedDevice) : Promise<void>{
    connectedDevice.disconnect();
    this.removeDeviceFromList(connectedDevice);
  }

  // Method to add an item to the list
  addDeviceToList(connectDevice: ConnectedDevice): void {
    this._devicesList.push(connectDevice);
    // Emit the signal when the list changes

    this.devicesListChanged.emit(this._devicesList);
    console.warn(
      `A device is added and the list has ${this._devicesList.length} devices`
    );
  }

  // Method to remove an item from the list
  removeDeviceFromList(connectedDevice: ConnectedDevice): void {
    console.log('before removing, the list of devices is:', this._devicesList);
    const index = this._devicesList.indexOf(connectedDevice);
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
    this._devicesList.forEach((connectedDevice, index) => {
      console.log(
        `device n°${index + 1} with deviceID ${connectedDevice.bluetoothDevice.id}`
      );
      connectedDevice.disconnect();
      this.removeDeviceFromList(connectedDevice);
      this.devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<ConnectedDevice>;
  public devicesListChanged;
  public justAddedAMoveHub;
}
