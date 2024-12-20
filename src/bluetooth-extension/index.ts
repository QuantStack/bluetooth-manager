import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { CommandIDs } from '../commands';
import { BluetoothConnectIcon } from '../icon';
import { CommandToolbarButton } from '@jupyterlab/ui-components';
import { BluetoothDeviceRunningItem } from '../bluetooth/BluetoothDeviceRunningItem';
import { IRunningSessions } from '@jupyterlab/running';
import {
  IBluetoothManager,
  BluetoothManager
} from '../bluetooth/BluetoothManager';
import { Dialog, showDialog } from '@jupyterlab/apputils';
/*import { RegistryDialogModel } from './RegistryDialogModel';
import { RegistryDialogView } from './RegistryDialogView';*/
import { Widget } from '@lumino/widgets';

export async function getServicesFromDevice(
  device: BluetoothDevice
): Promise<Array<BluetoothRemoteGATTService> | undefined> {
  const server = await device.gatt?.connect();
  const services = await server?.getPrimaryServices(); // Get all services exposed by the device
  return services;
}


const BluetoothManagerPlugin: JupyterFrontEndPlugin<IBluetoothManager> = {
  id: 'bluetooh-manager:bluetooth-manager-plugin',
  description: 'Provides the bluetooth manager',
  provides: IBluetoothManager,
  autoStart: true,
  activate: (app: JupyterFrontEnd): IBluetoothManager => {
    console.log('bluetooth-manager-plugin is activated.');
    return new BluetoothManager();
  }
};
/*function getIdentifierList(bluetoothManager: IBluetoothManager) {
  let identifierList: Array<string> = [];
  bluetoothManager.registry.itemsList.forEach(item => {
    identifierList.push(item.identifier);
  });
  return identifierList;
}*/

const BluetoothSidebarPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:bluetooth-sidebar-plugin',
  description:
    'Provides the connected bluetooth devices dialog to populate the sidebar.',
  requires: [IRunningSessionManagers, ITranslator, IBluetoothManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    managers: IRunningSessionManagers,
    translator: ITranslator,
    bluetoothManager: IBluetoothManager
  ): void => {
    console.log('bluetooth-manager plugin is activated.');
    const trans = translator.load('jupyterlab');
    const { commands } = app;
    const openDevicesRegistryDialogLabel = trans.__(
      'Open Dialog Showing Devices Registry'
    );
    let runningItemsList: Array<IRunningSessions.IRunningItem>;
    //const model = new RegistryDialogModel(bluetoothManager);
    //const view = new RegistryDialogView(model, translator);
    //const registryIdentifierList = getIdentifierList(bluetoothManager);
    app.commands.addCommand(CommandIDs.openDevicesRegistryDialog, {
      execute: async () => {
        showDialog({
          title: 'Select device type',
          body: new DropDownRegistry(bluetoothManager.registry),
          buttons: [
            Dialog.okButton({ label: 'OK' }),
            Dialog.cancelButton({ label: 'Cancel' })
          ]
        }).then(async result => {
          if (result.button.accept) {
            bluetoothManager.registry.itemsList.forEach(async item => {
              if (item.identifier === result.value) {
                
                await bluetoothManager.connectDevice(item);
              } else {
                console.warn(`There is no corresponding item in the registry`);
              }
            });
          }
        });
      }
    });
    managers.add({
      name: trans.__('Connected Devices'),
      supportsMultipleViews: false,
      running: () => {
        runningItemsList = [];
        bluetoothManager.devicesList.forEach(device => {
          runningItemsList.push(new BluetoothDeviceRunningItem(device));
        });
        return runningItemsList;
      },
      shutdownAll: () => {
        bluetoothManager.removeAllDevices(bluetoothManager.devicesList);
      },
      refreshRunning: () => {
        return void 0;
      },
      runningChanged: bluetoothManager.devicesListChanged,
      shutdownLabel: trans.__('Disconnect'),
      shutdownAllLabel: trans.__('Disconnect All'),
      shutdownAllConfirmationText: trans.__(
        'Are you sure you want to disconnect all devices?'
      ),
      toolbarButtons: [
        new CommandToolbarButton({
          commands,
          id: CommandIDs.openDevicesRegistryDialog,
          icon: BluetoothConnectIcon,
          caption: openDevicesRegistryDialogLabel,
          args: { toolbar: false }
        })
      ]
    });
  }
};

export class DropDownRegistry
  extends Widget
  implements Dialog.IBodyWidget<string>
{
  constructor(registry: BluetoothManager.DeviceRegistry) {
    super();

    this._selectList = document.createElement('select');
    this.node.appendChild(this._selectList);
    this.registry = registry;

    registry.itemsList.forEach(item => {
      const option = document.createElement('option');
      option.value = item.identifier;
      option.text = item.identifier;
      this._selectList.appendChild(option);
    });
  }

  getValue(): string {
    return this._selectList.value;
  }
  private _selectList: HTMLSelectElement;
  public registry: BluetoothManager.DeviceRegistry;
}

const BluetoothExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  BluetoothManagerPlugin,
  BluetoothSidebarPlugin
];
export default BluetoothExtensionPlugins;
