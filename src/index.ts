import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {SidePanel } from '@jupyterlab/ui-components';
import { BluetoothIcon } from './icon';
import LegoBoost from 'lego-boost-browser';

const webBluetoothManager: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:web-bluetooth-manager-plugin',
  description: 'Provide a UI for the web bluetooth manager.',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: activateWebBluetoothManager
};

async function activateWebBluetoothManager(app: JupyterFrontEnd) {
  console.log('We are in activate method');
  const panel = new SidePanel();
  panel.title.icon = BluetoothIcon;
  panel.title.iconClass = 'jp-SideBar-tabIcon';
  panel.title.caption = 'Web bluetooth manager';
  panel.id ="web-bluetooth-manager-ui";
  app.shell.add(panel, 'left', { rank: 102, type: '' });
  const boost = new LegoBoost()
  console.log("boost:", boost)
}

const plugins: JupyterFrontEndPlugin<any>[] = [webBluetoothManager];
export default plugins;
