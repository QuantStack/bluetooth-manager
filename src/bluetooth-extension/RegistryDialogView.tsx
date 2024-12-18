import { RegistryDialogModel } from './RegistryDialogModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';
import {
  IBluetoothManager,
  BluetoothManager,
  IDeviceRegistryItem
} from '../bluetooth/BluetoothManager';

export class RegistryDialogView extends VDomRenderer<RegistryDialogModel> {
  public translator: ITranslator;
  public registry: BluetoothManager.DeviceRegistry;
  public bluetoothManager: IBluetoothManager;

  constructor(model: RegistryDialogModel, translator: ITranslator) {
    super(model);
    this.translator = translator;
    this.registry = model.bluetoothManager.registry;
    this.bluetoothManager = model.bluetoothManager;
  }

  render() {
    return (
      <>
        <div style={{ width: '400px' }}>
          <ul>
            {this.registry.itemsList.map((item: IDeviceRegistryItem, index) => {
              return (
                <li style={{ listStyleType: 'none' }} key={index}>
                  <div style={{ display: 'flex' }}>
                    <div>{item.identifier}</div>
                    <button
                      onClick={async () => {
                        console.log('You have clicked');
                        const device = await this.bluetoothManager.connectDevice(item);
                        console.log('device:', device)
                        
                      }}
                      style={{
                        textAlign: 'center',
                        alignItems: 'center',
                        //padding: '0.5rem 1rem',
                        backgroundColor: 'var(--jp-accept-color-normal)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        marginTop: '-10px'
                      }}
                    >
                      Select
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }
}
