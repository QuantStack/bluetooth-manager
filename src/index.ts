import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { addConnectecDevicesSessionManager } from './connectedDevices';

const ConnectedDevicesPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:connected-devices-plugin',
  description: 'Provides the running session managers.',
  requires: [IRunningSessionManagers, ITranslator],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    managers: IRunningSessionManagers,
    translator: ITranslator
  ): void => {

    addConnectecDevicesSessionManager(managers, translator, app);
  }
};

const plugins: JupyterFrontEndPlugin<any>[] = [ConnectedDevicesPlugin];
export default plugins;
