import { VDomModel } from '@jupyterlab/apputils';
import ConnectedDevice from './ConnectedDevice';

export class MoveHubPanelModel extends VDomModel {
  public connectedDevice: ConnectedDevice;

  constructor(connectedDevice: ConnectedDevice) {
    super();
    this.connectedDevice = connectedDevice;
  }
}
