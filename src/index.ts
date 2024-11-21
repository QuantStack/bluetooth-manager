import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { addConnectedDevicesManager } from './ConnectedDevicesManager';
import { CommandIDs } from './commands';
import { MoveHubPanelModel } from './MoveHubPanelModel';
import { MoveHubPanelView } from './MoveHubPanelView';
//import { HubAsync } from './moveHub/hub/hubAsync';
import { connect } from './device';


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
    addConnectedDevicesManager(managers, translator, app);
  }
};

const MoveHubPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:move-hub_panel-plugin',
  description: 'Provides the ui to control the move hub.',
  requires: [IRunningSessionManagers, ITranslator],
  optional: [],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    managers: IRunningSessionManagers,
    translator: ITranslator
  ): void => {
    const trans = translator.load('jupyterlab');
    app.commands.addCommand(CommandIDs.addLegoboostControllerPanel, {
      execute: args => {
     
      const model = new MoveHubPanelModel();
      const view = new MoveHubPanelView(model, translator);
      view.addClass('jp-move-hub-panel');
      view.id = 'move-hub-panel-plugin';
      view.title.label = 'Move Hub Controller';
      view.title.closable = true;
      app.shell.add(view, 'main');
      console.log('JupyterLab extension jupyter-theme-editor is activated!');
      },
  
      caption: trans.__('Add a Move Hub controller panel.'),
      label: trans.__('Add a Move Hub Controller Panel')
    });
  }
};

const plugins: JupyterFrontEndPlugin<any>[] = [ConnectedDevicesPlugin, MoveHubPanelPlugin];
export default plugins;
