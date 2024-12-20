import { MoveHubPanelModel } from './MoveHubPanelModel';
import { MoveHubPanelView } from './MoveHubPanelView';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';

import {
  IDeviceRegistryItem,
  IBluetoothManager,
  BluetoothManager
} from '../bluetooth/BluetoothManager';
import { MoveHub } from './moveHub';
export namespace CommandIDs {
  export const addLegoBoostControlPanel =
    'bluetooth-manager:add-lego-boost-control-panel';
}

const moveHubServiceUUID = '00001623-1212-efde-1623-785feabcd123';

const MoveHubRegisterPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:move-hub-register-plugin',
  description: 'Registers the move hub device and provides a factory.',
  requires: [IBluetoothManager, ITranslator],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    bluetoothManager: BluetoothManager,
    translator: ITranslator
  ): void => {
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
  }
};

const LegoBoostControlPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:lego-boost-control-panel-plugin',
  description: 'Provides the ui to control the legoboost robot.',
  requires: [ITranslator, IBluetoothManager],
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
        console.log('bluetooth manager');
        console.log('bluetooth manager:', bluetoothManager.devicesList);
        const result = bluetoothManager.devicesList.filter(
          device => device instanceof MoveHub
        );
        const device: MoveHub = result[0];
        console.log(typeof(device))
        const model = new MoveHubPanelModel(device);
        const view = new MoveHubPanelView(model, translator);
        view.addClass('jp-lego-boost-control-panel');
        view.id = 'lego-boost-control-panel';
        view.title.label = 'Lego Boost Control Panel';
        view.title.closable = true;
        app.shell.add(view, 'main');
        /*} else {
              throw new Error('The device is not a Move Hub.');
            }*/
        // }
        //);
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
  MoveHubRegisterPlugin,
  LegoBoostControlPanelPlugin
];
export default MoveHubExtensionPlugins;
