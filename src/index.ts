import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { CommandIDs } from './commands';
import { MoveHubPanelModel } from './MoveHubPanelModel';
import { MoveHubPanelView } from './MoveHubPanelView';
import { BluetoothConnectIcon } from './icon';
import { CommandToolbarButton } from '@jupyterlab/ui-components';
import { ConnectedDeviceRunningItem } from './ConnectedDeviceRunningItem';
import { IRunningSessions } from '@jupyterlab/running';
import ConnectedDevice from './ConnectedDevice';
import { IConnectedDevicesManager } from './token';
import { ConnectedDevicesManager } from './ConnectedDevicesManager';

const ConnectedDevicesManagerPlugin: JupyterFrontEndPlugin<IConnectedDevicesManager> =
  {
    id: 'jupyterlab-web-bluetooth-manager:connected-devices-manager-plugin',
    description: 'Provides the running session managers.',
    provides: IConnectedDevicesManager,
    requires: [IRunningSessionManagers, ITranslator],
    optional: [],
    autoStart: true,
    activate: (
      app: JupyterFrontEnd,
      managers: IRunningSessionManagers,
      translator: ITranslator
    ): IConnectedDevicesManager => {
      const trans = translator.load('jupyterlab');
      const { commands } = app;
      const connectDeviceLabel = trans.__('Connect Device');
      let runningItemsList: Array<IRunningSessions.IRunningItem>;
      let devicesList: Array<ConnectedDevice> = [];
      const connectedDevicesManager = new ConnectedDevicesManager(devicesList);

      /* Add commands to the commandRegistry */
      commands.addCommand(CommandIDs.connectDevice, {
        execute: async args => {
          await connectedDevicesManager.connectDevice(app);
        },
        caption: trans.__('Connect device.')
      });

      commands.addCommand(CommandIDs.disconnectDevice, {
        execute: async args => {},
        caption: trans.__('Disconnect device.'),
        label: trans.__('Disconnect device.')
      });

      app.commands.addCommand(CommandIDs.alternativeDevice, {
        execute: args => {},
        caption: trans.__('Custom command to be set.'),
        label: trans.__('Custom command to be set')
      });

      /* Adding commands to the context menu of the relevant connected device*/
      app.contextMenu.addItem({
        command: CommandIDs.disconnectDevice,
        selector: `jp-tree-item.jp-RunningSessions-item`,
        rank: 0
      });

      app.contextMenu.addItem({
        command: CommandIDs.alternativeDevice,
        selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-Forerunner-35`,
        rank: 1
      }),
        app.contextMenu.addItem({
          command: CommandIDs.addLegoboostControllerPanel,
          selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-LEGO-Move-Hub`,
          rank: 1
        });

      managers.add({
        name: trans.__('Connected Devices'),
        supportsMultipleViews: false,
        running: () => {
          runningItemsList = [];
          devicesList.forEach(device => {
            runningItemsList.push(
              new ConnectedDeviceRunningItem(device, connectedDevicesManager)
            );
          });
          return runningItemsList;
        },
        shutdownAll: () => {
          connectedDevicesManager.removeAllDevices();
        },
        refreshRunning: () => {
          return void 0;
        },
        runningChanged: connectedDevicesManager.devicesListChanged,
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
      return connectedDevicesManager;
    }
  };

const MoveHubPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:move-hub-panel-plugin',
  description: 'Provides the ui to control the move hub.',
  requires: [ITranslator, IConnectedDevicesManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    devicesManager: ConnectedDevicesManager
  ): void => {
    const trans = translator.load('jupyterlab');
    console.log('JupyterLab extension move-hub-panel-plugin is activated!');
    devicesManager.justAddedAMoveHub.connect((sender, device) => {
      device.initDevice();
    });
  

    app.commands.addCommand(CommandIDs.addLegoboostControllerPanel, {
      execute: args => {
        devicesManager.justAddedAMoveHub.connect(
          (sender, device) => {
            const model = new MoveHubPanelModel(device);
            const view = new MoveHubPanelView(model, translator);
            view.addClass('jp-move-hub-panel');
            view.id = 'move-hub-panel-plugin';
            view.title.label = 'Move Hub Controller';
            view.title.closable = true;
            app.shell.add(view, 'main');
          }
          //}
        );
      },

      caption: trans.__('Add a Move Hub controller panel.'),
      label: trans.__('Add a Move Hub Controller Panel')
    });
  }
};

const plugins: JupyterFrontEndPlugin<any>[] = [
  ConnectedDevicesManagerPlugin,
  MoveHubPanelPlugin
];
export default plugins;
