import { VDomModel } from '@jupyterlab/apputils';
import { IBluetoothManager } from '../bluetooth/BluetoothManager';

export class RegistryDialogModel extends VDomModel {
  public bluetoothManager: IBluetoothManager;

  constructor(bluetoothManager: IBluetoothManager) {
    super();
    this.bluetoothManager = bluetoothManager;
  }
}
