/*import { MoveHubPanelModel } from './MoveHubPanelModel';
import { MoveHubPanelView } from './MoveHubPanelView';*/
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import {
  BluetoothManager,
  IDeviceRegistryItem
} from '../bluetooth/BluetoothManager';
import { IBluetoothManager } from '../bluetooth/BluetoothManager';
import { MoveHub } from './moveHub';
import { CommandIDs } from '../commands';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

const moveHubServiceUUID = '00001623-1212-efde-1623-785feabcd123';

const MoveHubPlugin: JupyterFrontEndPlugin<IBluetoothManager> = {
  id: 'bluetooh-manager:move-hub-plugin',
  description: 'Registers the move hub device and provide a factory.',
  requires: [ITranslator, IBluetoothManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    bluetoothManager: BluetoothManager
  ): IBluetoothManager => {
    console.log('JupyterLab extension move-hub-plugin is activated!');
    const movehubRegistryItem: IDeviceRegistryItem = {
      identifier: 'LEGO® MoveHub',
      options: {
        acceptAllDevices: false,
        filters: [{ services: [moveHubServiceUUID] }],
        optionalServices: [moveHubServiceUUID]
      },
      factory: async (native: BluetoothDevice) => {
        let device = new MoveHub();
        device.native = native;
        device = await device.initDevice();
        const hub = device.hub;

        if (!hub) {
          throw new Error('Hub initialization failed.');
        }
        return device;
      }
    };

    bluetoothManager.register(movehubRegistryItem);
    return bluetoothManager;
  }
};

const MoveHubControlPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:move-hub-control-panel-plugin',
  description: 'Provides the ui to control the move hub.',
  requires: [ITranslator, IBluetoothManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    bluetoothManager: BluetoothManager
  ): void => {
    console.log(
      'JupyterLab extension move-hub-control-panel-plugin is activated!'
    );
    const trans = translator.load('jupyterlab');

    app.commands.addCommand(CommandIDs.addLegoBoostControlPanel, {
      execute: args => {
        bluetoothManager.connectedADevice.connect(
          async (sender, device: MoveHub) => {
            //const model = new MoveHubPanelModel(device);
            //const view = new MoveHubPanelView(model, translator);
            const content = new Widget();
       
          content.node.innerHTML = `
          <div style="padding: 20px;">
            <h1>Hello, JupyterLab!</h1>
            <p>Hello</p>
          </div>
        `;
          content.addClass('example-main-area-widget');
          const view = new MainAreaWidget({ content });
          
            view.addClass('jp-lego-boost-control-panel');
            view.id = 'lego-boost-control-panel';
            view.title.label = 'Lego Boost Control Panel';
            view.title.closable = true;
            app.shell.add(view, 'main');
          }
        );
      },

      caption: trans.__('Add a Lego Boost control panel.'),
      label: trans.__('Add a Lego Boost Control Panel')
    });
    app.contextMenu.addItem({
      command: CommandIDs.addLegoBoostControlPanel,
      selector: `jp-tree-item.jp-RunningSessions-item.jp-bluetooth-Move-Hub`,
      rank: 1
    });
  }
};

const MoveHubExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  MoveHubPlugin,
  MoveHubControlPanelPlugin
];
export default MoveHubExtensionPlugins;
