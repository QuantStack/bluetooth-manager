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
import { RegistryDialogModel } from './RegistryDialogModel';
import { RegistryDialogView } from './RegistryDialogView';

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
    const model = new RegistryDialogModel(bluetoothManager);
    const view = new RegistryDialogView(model, translator);
    
    app.commands.addCommand(CommandIDs.openDevicesRegistryDialog, {
      execute: async () => {
        showDialog({
          title: 'Select an item from the registry',
          body: view,
          buttons: [
            Dialog.okButton({ label: 'OK' }),
            Dialog.cancelButton({ label: 'Cancel' })
          ]
        }).then(result => {
          if (result.button.accept) {
            console.log('OK button clicked');
          } else {
            console.log('Cancel button clicked');
          }
        });
      }
      /*icon: BluetoothConnectIcon.bindprops({ stylesheet: 'menuItem' }),
      caption: trans.__('Open a dialog to display the devices registry.'),
      label: trans.__('Open A Dialog To Display the Devices Registry.')*/
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
const BluetoothExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  BluetoothManagerPlugin,
  BluetoothSidebarPlugin
];
export default BluetoothExtensionPlugins;
