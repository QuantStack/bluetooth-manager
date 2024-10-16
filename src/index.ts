import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { SidePanel } from '@jupyterlab/ui-components';
import { BluetoothIcon } from './icon';
import { BluetoothPanelModel } from './model';
import { BluetoothPanelView } from './view';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessionManagers } from '@jupyterlab/running';
import LegoBoost from 'lego-boost-browser';
import { addConnectecDevicesSessionManager } from './connectedDevices';

const ConnectedDevicesPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:connected-devices-plugin',
  description: 'Provides the running session managers.',
  requires: [IRunningSessionManagers, ITranslator],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    runningSessionManagers: IRunningSessionManagers,
    translator: ITranslator
  ): void => {
    const devicesList: Array<LegoBoost> = [];
    const model = new BluetoothPanelModel(devicesList);
    const view = new BluetoothPanelView(model /*, translator*/);
    view.addClass('jp-theme-editor-view-panel');
    view.id = 'bluetooth-panel';
    app.shell.add(view, 'left');
    const panel = new SidePanel();
    view.title.icon = BluetoothIcon;
    panel.title.caption = 'Web bluetooth manager';
    panel.id = 'web-bluetooth-manager-ui';
    app.shell.add(view, 'left', { rank: 102, type: '' });
    addConnectecDevicesSessionManager(
      runningSessionManagers,
      translator,
      model
    );
  }
};




const plugins: JupyterFrontEndPlugin<any>[] = [
  ConnectedDevicesPlugin,
];
export default plugins;
