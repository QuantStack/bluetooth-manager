import { MoveHubPanelModel } from './moveHubPanelModel';
import { MoveHubPanelView } from './moveHubPanelView';
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
  export const addVernieLEGOBoostControlPanel =
    'bluetooth-manager:add-vernie-lego-boost-control-panel';
}
export const moveHubServiceUUID = '00001623-1212-efde-1623-785feabcd123';
export const moveHubCharacteristicUUID = '00001624-1212-efde-1623-785feabcd123';

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
    console.log('JupyterLab move-hub-register plugin is activated!');
    const movehubRegistryItem: IDeviceRegistryItem = {
      identifier: 'LEGO® Move Hub',
      options: {
        acceptAllDevices: false,
        filters: [{ services: [moveHubServiceUUID] }],
        optionalServices: [moveHubServiceUUID]
      },
      factory: async (native: BluetoothDevice) => {
        let device = new MoveHub(native);
        await device.initDevice();
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

const VernieLEGOBoostControlPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:vernie-legoboost-control-panel-plugin',
  description: 'Provides the ui to control Vernie robot.',
  requires: [ITranslator, IBluetoothManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    bluetoothManager: BluetoothManager
  ): void => {
    console.log(
      'JupyterLab vernie-legoboost-control-panel plugin is activated!'
    );

    const trans = translator.load('jupyterlab');

    app.commands.addCommand(CommandIDs.addVernieLEGOBoostControlPanel, {
      execute: args => {
        const result = bluetoothManager.deviceList.filter(
          device => device instanceof MoveHub
        );
        if (result) {
          const device = result[
            result.length - 1
          ] as MoveHub; /* the last added MoveHub device*/
          const model = new MoveHubPanelModel(device);
          const view = new MoveHubPanelView(model, translator);
          view.addClass('jp-lego-boost-vernie-control-panel');
          view.id = 'lego-boost-vernie-control-panel';
          view.title.label = 'LEGO® Boost Vernie Control Panel';
          view.title.closable = true;
          app.shell.add(view, 'main');
        } else {
          throw new Error('The device is not a Move Hub.');
        }
      },

      caption: trans.__('Add a Vernie LEGO® Boost control panel.'),
      label: trans.__('Add a Vernie LEGO® Boost Control Panel')
    });

    app.contextMenu.addItem({
      command: CommandIDs.addVernieLEGOBoostControlPanel,
      selector: `jp-tree-item.jp-RunningSessions-item.jp-bluetooth-LEGO-Move-Hub`,
      rank: 1
    });

    app.contextMenu.addItem({
      command: CommandIDs.addVernieLEGOBoostControlPanel,
      selector: `jp-tree-item.jp-RunningSessions-item.jp-bluetooth-Move-Hub`,
      rank: 1
    });
  }
};

const MoveHubExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  MoveHubRegisterPlugin,
  VernieLEGOBoostControlPanelPlugin
];
export default MoveHubExtensionPlugins;
