/*import { MoveHubPanelModel } from './MoveHubPanelModel';
import { MoveHubPanelView } from './MoveHubPanelView';*/
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { BluetoothManager } from '../bluetooth/BluetoothManager';
import { IBluetoothManager } from '../bluetooth/BluetoothManager';
//import { CommandIDs } from '../commands';

const MoveHubPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:move-hub-plugin',
  description: 'Provides the ui to control the move hub.',
  requires: [ITranslator, IBluetoothManager],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
   bluetoothManager: BluetoothManager
  ): void => {
    //let moveHubDevice: BluetoothManager.Device;
    //const trans = translator.load('jupyterlab');
    console.log('JupyterLab extension move-hub-plugin is activated!');
   /* bluetoothManager.connectedADevice.connect(async (sender, device: BluetoothManager.Device) => {
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
    });*/

    /*app.commands.addCommand(CommandIDs.addLegoBoostControlPanel, {
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
    });*/
  }
};

const MoveHubExtensionPlugins: JupyterFrontEndPlugin<any>[] = [MoveHubPlugin];
export default MoveHubExtensionPlugins;
