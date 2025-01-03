import { IRunningSessions } from '@jupyterlab/running';
import { BluetoothConnectIcon } from './icon';
import { BluetoothManager } from './BluetoothManager';
import { buildIdentifier } from '../bluetooth-extension';

export class BluetoothDeviceRunningItem
  implements IRunningSessions.IRunningItem
{
  constructor(device: BluetoothManager.Device) {
    this._device = device;

    if (this._device.native.name) {
      let deviceName = this._device.native.name;
      this.className = 'jp-bluetooth-' + deviceName.replace(/\s+/g, '-');
      console.log('className:', this.className);
    }
  }

  className?: string | undefined;

  icon() {
    return BluetoothConnectIcon;
  }
  label() {
    //return this._device.native.name+ '\u00A0'.repeat(30) + this._device.native.id;
    return this._device.native.name + '\t' + this._device.native.id;
  }
  labelTitle() {
    const title = buildIdentifier(this._device);
    return title;
  }

  shutdown() {
    this.manager.disconnectDevice(this._device);
  }

  private _device: BluetoothManager.Device;
  public manager: BluetoothManager;
}
