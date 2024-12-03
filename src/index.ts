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
import ConnectedDevice, {
  LightBulb,
  Loudspeaker,
  MoveHub,
  SmartWatch
} from './ConnectedDevice';
import { IConnectedDevicesManager } from './token';
import { ConnectedDevicesManager } from './ConnectedDevicesManager';
//import { colorValues } from './ColorSelector';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

const ConnectedDevicesManagerPlugin: JupyterFrontEndPlugin<IConnectedDevicesManager> =
  {
    id: 'bluetooh-manager:connected-devices-manager-plugin',
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

const MoveHubPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:move-hub-plugin',
  description: 'Provides the ui to control the move hub.',
  requires: [ITranslator, IConnectedDevicesManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    devicesManager: ConnectedDevicesManager
  ): void => {
    let moveHubDevice: MoveHub;
    const trans = translator.load('jupyterlab');
    console.log('JupyterLab extension move-hub-panel-plugin is activated!');
    devicesManager.justAddedAMoveHub.connect(
      async (sender, device: MoveHub) => {
        const movehub = await device.initDevice(); // Ensure device is fully initialized
        const hub = movehub.hub;
        hub.emitter.on('color', async evt => {
          await hub.ledAsync('orange');
        });

        hub.emitter.on('distance', async evt => {
          await hub.ledAsync(10);
        });

        moveHubDevice = movehub; // Assign to global variable

        if (!hub) {
          console.error('Hub initialization failed.');
          return;
        }
      }
    );

    app.commands.addCommand(CommandIDs.addLegoBoostControlPanel, {
      execute: args => {
        const model = new MoveHubPanelModel(moveHubDevice);
        const view = new MoveHubPanelView(model, translator);

        view.addClass('jp-lego-boost-control-panel');
        view.id = 'lego-boost-control-panel';
        view.title.label = 'Lego Boost Control Panel';
        view.title.closable = true;
        app.shell.add(view, 'main');
      },

      caption: trans.__('Add a Lego Boost control panel.'),
      label: trans.__('Add a Lego Boost Control Panel')
    });
  }
};

const SmartWatchPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:smart-watch-plugin',
  description: 'Enable the connection to the relevant service for a smart watch.',
  requires: [ITranslator, IConnectedDevicesManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    devicesManager: ConnectedDevicesManager
  ): void => {
    let smartWatchDevice: SmartWatch;
    console.log('JupyterLab extension smart-watch-plugin is activated!');
    const trans = translator.load('jupyterlab');
    devicesManager.justAddedASmartWatch.connect(
      async (sender, device: SmartWatch) => {
        const smartWatch = await device.initDevice(); // Ensure device is fully initialized
        smartWatchDevice = smartWatch;
      }
    );

    app.commands.addCommand(CommandIDs.addSmartWatchControlPanel, {
      execute: args => {
        const content = new Widget();
        if (smartWatchDevice) {
          content.node.innerHTML = `
          <div style="padding: 20px;">
            <h1>Hello, JupyterLab!</h1>
            <p>${smartWatchDevice.deviceID}.</p>
          </div>
        `;
          content.addClass('example-main-area-widget');
          const mainAreaWidget = new MainAreaWidget({ content });
          mainAreaWidget.id = 'smart-watch-control-panel';
          mainAreaWidget.title.label = 'Smart Watch COntrol Panel';
          mainAreaWidget.title.closable = true;

          // Add the MainAreaWidget to the shell
          app.shell.add(mainAreaWidget, 'main');
        } else console.warn('there is no smart watch device');
      },

      caption: trans.__('Add a smart watch control watch panel.'),
      label: trans.__('Add a Smart Watch Control Panel')
    });
  }
};

const LoudSpeakerPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:loudspeaker-plugin',
  description: 'Enable the connection to the relevant service for a loudspeaker.',
  requires: [ITranslator, IConnectedDevicesManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    devicesManager: ConnectedDevicesManager
  ): void => {
    console.log('JupyterLab extension loudspeaker-panel-plugin is activated!');
    devicesManager.justAddedALoudspeaker.connect(
      async (sender, device: Loudspeaker) => {
        const loudspeaker = await device.initDevice(); // Ensure device is fully initialized
        console.log('loudspeaker:', loudspeaker);
      }
    );
  }
};


const LightBulbPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:light-bulb-plugin',
  description: 'Enable the connection to the relevant service for a smart light bulb.',
  requires: [ITranslator, IConnectedDevicesManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    devicesManager: ConnectedDevicesManager
  ): void => {
    console.log('JupyterLab extension loudspeaker-panel-plugin is activated!');
    devicesManager.justAddedALightBulb.connect(
      async (sender, device: LightBulb) => {

        const lightBulb= await device.initDevice(); // Ensure device is fully initialized
        console.log('lightBulb:', lightBulb)
   
      }
    );
  }
};


const plugins: JupyterFrontEndPlugin<any>[] = [
  ConnectedDevicesManagerPlugin,
  MoveHubPlugin,
  SmartWatchPlugin,
  LoudSpeakerPlugin,
  LightBulbPlugin
];
export default plugins;
