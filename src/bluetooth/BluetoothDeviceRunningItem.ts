

import { IRunningSessions } from '@jupyterlab/running';
import { BluetoothConnectIcon } from '../icon';
import { BluetoothManager } from './BluetoothManager';


export class BluetoothDeviceRunningItem implements IRunningSessions.IRunningItem {
    constructor(device: BluetoothManager.Device) {
      this._device = device;
    
      if (this._device.bluetoothDevice.name) {
        let deviceName = this._device.bluetoothDevice.name;
        this.className = 'jp-ConnectedDevice-' + deviceName.replace(/\s+/g, '-');
      }
    }
  
    className?: string | undefined;
  
    icon() {
      return BluetoothConnectIcon;
    }
    label() {
      return this._device.bluetoothDevice.name + ' (' + this._device.bluetoothDevice.id + ')';
    }
    labelTitle() {
      return this._device.bluetoothDevice.id;
    }
  
    shutdown() {
      this.manager.disconnectDevice(this._device);
    }
  
    private _device: BluetoothManager.Device;
    public manager: BluetoothManager;
  }
  