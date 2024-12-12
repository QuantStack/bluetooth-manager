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
  import { IBluetoothManager, BluetoothManager } from '../bluetooth/BluetoothManager';

  
  export const BluetoothManagerPlugin: JupyterFrontEndPlugin<IBluetoothManager> =
    {
      id: 'bluetooh-manager:bluetooth-manager-plugin',
      description: 'Provides the running session managers.',
      provides: IBluetoothManager,
      requires: [IRunningSessionManagers, ITranslator],
      optional: [],
      autoStart: true,
      activate: (
        app: JupyterFrontEnd,
        managers: IRunningSessionManagers,
        translator: ITranslator
      ): IBluetoothManager => {
        const trans = translator.load('jupyterlab');
        const { commands } = app;
        const connectDeviceLabel = trans.__('Connect Device');
        let runningItemsList: Array<IRunningSessions.IRunningItem>;
       
        const bluetoothManager: IBluetoothManager = new BluetoothManager();
        let devicesList= bluetoothManager.devicesList;
        const identifier = 'Move Hub';
  
        /* Add commands to the commandRegistry */
        commands.addCommand(CommandIDs.connectDevice, {
          execute: async args => {
            await bluetoothManager.connectDevice(identifier);
          },
          caption: trans.__('Connect device.')
        });
  
        commands.addCommand(CommandIDs.disconnectDevice, {
          execute: async args => {},
          caption: trans.__('Disconnect device.'),
          label: trans.__('Disconnect device.')
        });
  
        /* Adding commands to the context menu of the relevant connected device*/
        app.contextMenu.addItem({
          command: CommandIDs.disconnectDevice,
          selector: `jp-tree-item.jp-RunningSessions-item`,
          rank: 0
        });
  
        app.contextMenu.addItem({
          command: CommandIDs.addSmartWatchControlPanel,
          selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-Forerunner-35`,
          rank: 1
        }),
          app.contextMenu.addItem({
            command: CommandIDs.addLegoBoostControlPanel,
            selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-LEGO-Move-Hub`,
            rank: 1
          });
        app.contextMenu.addItem({
          command: CommandIDs.addLegoBoostControlPanel,
          selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-Move-Hub`,
          rank: 1
        });
  
        managers.add({
          name: trans.__('Connected Devices'),
          supportsMultipleViews: false,
          running: () => {
            runningItemsList = [];
            devicesList.forEach(device => {
              runningItemsList.push(
                new BluetoothDeviceRunningItem(device)
              );
            });
            return runningItemsList;
          },
          shutdownAll: () => {
           bluetoothManager.removeAllDevices(devicesList);
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
              id: CommandIDs.connectDevice,
              icon: BluetoothConnectIcon,
              caption: connectDeviceLabel,
              args: { toolbar: false }
            })
          ]
        });
        return bluetoothManager;
      }
    };
const BluetoothExtensionPlugins: JupyterFrontEndPlugin<any>[] = [BluetoothManagerPlugin];
export default BluetoothExtensionPlugins;

