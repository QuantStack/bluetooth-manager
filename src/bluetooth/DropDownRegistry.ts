import { Widget } from '@lumino/widgets';
import { Dialog } from '@jupyterlab/apputils';
import { BluetoothManager } from './BluetoothManager';

export class DropDownRegistry
  extends Widget
  implements Dialog.IBodyWidget<string>
{
  constructor(registry: BluetoothManager.DeviceTypeRegistry) {
    super();
    this._selectList = document.createElement('select');
    this.node.appendChild(this._selectList);
    this.registry = registry;
    registry.deviceTypes.forEach(item => {
      const option = document.createElement('option');
      option.value = item.deviceType;
      option.text = item.deviceType;
      this._selectList.appendChild(option);
    });
  }

  getValue(): string {
    return this._selectList.value;
  }

  private _selectList: HTMLSelectElement;
  public registry: BluetoothManager.DeviceTypeRegistry;
}
