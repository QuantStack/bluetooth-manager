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
import ipymovehubPlugin from './plugin';
export * from './version';
export * from './widget';
export namespace CommandIDs {
  export const addLEGOMoveHubControlPanel =
    'bluetooth-manager:add-lego-movehub-control-panel';
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

const LEGOMoveHubControlPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:lego-movehub-control-panel-plugin',
  description: 'Provides the ui to display informations on the Move Hub state.',
  requires: [ITranslator, IBluetoothManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    bluetoothManager: BluetoothManager
  ): void => {
    console.log(
      'JupyterLab lego-movehub-control-panel plugin is activated!'
    );

    const trans = translator.load('jupyterlab');

    app.commands.addCommand(CommandIDs.addLEGOMoveHubControlPanel, {
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
          view.addClass('jp-lego-movehub-control-panel');
          view.id = 'lego-movehub-control-panel';
          view.title.label = 'LEGO® Move Hub Control Panel';
          view.title.closable = true;
          app.shell.add(view, 'main');
        } else {
          throw new Error('The device is not a Move Hub.');
        }
      },

      caption: trans.__('Add LEGO® Move Hub control panel.'),
      label: trans.__('Add a LEGO® Move Hub Control Panel')
    });

    app.contextMenu.addItem({
      command: CommandIDs.addLEGOMoveHubControlPanel,
      selector: `jp-tree-item.jp-RunningSessions-item.jp-bluetooth-LEGO-Move-Hub`,
      rank: 1
    });

    app.contextMenu.addItem({
      command: CommandIDs.addLEGOMoveHubControlPanel,
      selector: `jp-tree-item.jp-RunningSessions-item.jp-bluetooth-Move-Hub`,
      rank: 1
    });
  }
};

const MoveHubExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  MoveHubRegisterPlugin,
  LEGOMoveHubControlPanelPlugin,
  ipymovehubPlugin
];
export default MoveHubExtensionPlugins;
