import { VDomModel } from '@jupyterlab/apputils';
import { MoveHub } from './ConnectedDevice';

export class MoveHubPanelModel extends VDomModel {
  public connectedDevice: MoveHub;

  constructor(connectedDevice: MoveHub) {
    super();
    this.connectedDevice = connectedDevice;
  }
}
