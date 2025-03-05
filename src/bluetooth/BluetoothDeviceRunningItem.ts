import { IRunningSessions } from '@jupyterlab/running';
import { BluetoothConnectIcon } from './icon';
import { BluetoothManager } from './BluetoothManager';
import { buildCompleteIdentifier } from '../bluetooth-extension';

export class BluetoothDeviceRunningItem
  implements IRunningSessions.IRunningItem
{
  constructor(device: BluetoothManager.Device, manager: BluetoothManager) {
    this._device = device;
    this.manager = manager;

    if (this._device.native.name) {
      let deviceName = this._device.native.name;
      this.className = 'jp-bluetooth-' + deviceName.replace(/\s+/g, '-');
    }
  }

  className?: string | undefined;

  icon() {
    return BluetoothConnectIcon;
  }

  label() {
    //return this._device.native.name+ '\u00A0'.repeat(30) + this._device.native.id;
    return this._device.native.name + ' (' + this._device.native.id + ')';
  }
  
  labelTitle() {
    const title = buildCompleteIdentifier(this._device.native);
    return title;
  }

  shutdown() {
    this.manager.disconnectDevice(this._device);
  }

  private _device: BluetoothManager.Device;
  public manager: BluetoothManager;
}
