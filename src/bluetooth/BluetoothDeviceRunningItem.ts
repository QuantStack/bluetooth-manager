

import { IRunningSessions } from '@jupyterlab/running';
import { BluetoothConnectIcon } from '../icon';
import { BluetoothManager } from './BluetoothManager';


export class BluetoothDeviceRunningItem implements IRunningSessions.IRunningItem {
    constructor(device: BluetoothManager.Device) {
      this._device = device;

    
      if (this._device.native.name) {
        let deviceName = this._device.native.name;
        console.log('Name:', this._device.native.name)
        this.className = 'jp-bluetooth-native-' + deviceName.replace(/\s+/g, '-');
      }
    }
  
    className?: string | undefined;
  
    icon() {
      return BluetoothConnectIcon;
    }
    label() {
      return this._device.native.name + ' (' + this._device.native.id + ')';
    }
    labelTitle() {
      return this._device.native.id;
    }
  
    shutdown() {
      this.manager.disconnectDevice(this._device);
    }
  
    private _device: BluetoothManager.Device;
    public manager: BluetoothManager;
  }
  