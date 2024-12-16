import { VDomModel } from '@jupyterlab/apputils';
import { BluetoothManager } from '../bluetooth/BluetoothManager';

export class MoveHubPanelModel extends VDomModel {
  public device: BluetoothManager.Device;

  constructor(device: BluetoothManager.Device) {
    super();
    this.device = device;
  }
}
