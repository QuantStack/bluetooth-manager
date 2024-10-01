import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';


import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { SidePanel } from '@jupyterlab/ui-components';
import { BluetoothIcon } from './icon';
import { BluetoothPanelModel } from './model';
import { BluetoothPanelView } from './view';
import { ITranslator } from '@jupyterlab/translation';

const webBluetoothManager: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:web-bluetooth-manager-plugin',
  description: 'Provide a UI for the web bluetooth manager.',
  autoStart: true,
  requires:[ITranslator],
  optional: [ISettingRegistry],
  activate: activateWebBluetoothManager
};

async function activateWebBluetoothManager(app: JupyterFrontEnd, translator: ITranslator) {
  const model = new BluetoothPanelModel();
  const view = new BluetoothPanelView(model/*, translator*/);
  view.addClass('jp-theme-editor-view-panel');
  view.id = 'bluetooth-panel';
  app.shell.add(view, 'left');
  const panel = new SidePanel();
  view.title.icon = BluetoothIcon;
  //panel.title.iconClass = 'jp-SideBar-tabIcon';
  panel.title.caption = 'Web bluetooth manager';
  panel.id = 'web-bluetooth-manager-ui';
  app.shell.add(view, 'left', { rank: 102, type: '' });
}
  

const plugins: JupyterFrontEndPlugin<any>[] = [webBluetoothManager];
export default plugins;
