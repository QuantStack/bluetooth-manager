import { VDomModel } from '@jupyterlab/apputils';
import { MoveHub } from './moveHub';

export class MoveHubPanelModel extends VDomModel {
  public device: MoveHub;

  constructor(device: MoveHub) {
    super();
    this.device = device;
  }
}
