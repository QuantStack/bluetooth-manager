import { VDomModel } from '@jupyterlab/apputils';
import LegoBoost from 'lego-boost-browser';

export class BluetoothPanelModel extends VDomModel {
   
    public devicesList: Array<LegoBoost>

    constructor(devicesList:Array<LegoBoost>) {
      super();
      this.devicesList = devicesList
    }

    
}