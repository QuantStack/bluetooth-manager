
import { IRunningSessions } from '@jupyterlab/running';
import { BluetoothConnectIcon } from './icon';
import { ConnectedDevicesManager } from './ConnectedDevicesManager';
import ConnectedDevice from './ConnectedDevice';

export class ConnectedDeviceRunningItem implements IRunningSessions.IRunningItem {
    constructor(connectedDevice: ConnectedDevice, manager: ConnectedDevicesManager) {
      this._connectedDevice = connectedDevice;
      this.manager = manager;
      if (this._connectedDevice.bluetoothDevice.name) {
        let deviceName = this._connectedDevice.bluetoothDevice.name;
        this.className = 'jp-ConnectedDevice-' + deviceName.replace(/\s+/g, '-');
      }
    }
  
    className?: string | undefined;
  
    icon() {
      return BluetoothConnectIcon;
    }
    label() {
      return this._connectedDevice.bluetoothDevice.name + ' (' + this._connectedDevice.bluetoothDevice.id + ')';
    }
    labelTitle() {
      return this._connectedDevice.bluetoothDevice.id;
    }
  
    shutdown() {
      this.manager.disconnectDevice(this._connectedDevice);
    }
  
    private _connectedDevice: ConnectedDevice;
    public manager: ConnectedDevicesManager;
  }
  