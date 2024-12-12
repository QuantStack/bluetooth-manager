import { VDomModel } from '@jupyterlab/apputils';
import { BluetoothManager } from '../bluetooth/BluetoothManager';

export class MoveHubPanelModel extends VDomModel {
  public connectedDevice: BluetoothManager.Device;

  constructor(connectedDevice: BluetoothManager.Device) {
    super();
    this.connectedDevice = connectedDevice;
  }
}
