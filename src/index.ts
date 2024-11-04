import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessionManagers } from '@jupyterlab/running';
import { addConnectedDevicesManager } from './ConnectedDevicesManager';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

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

const LegoBoostControlPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-web-bluetooth-manager:legoboost-control-plugin',
  description: 'Provides the running session managers.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyterlab_apod is activated!');

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = () => {
      // Create a blank content widget inside of a MainAreaWidget
      const content = new Widget();
      const widget = new MainAreaWidget({ content });
      widget.id = 'legoboost-controller';
      widget.title.label = 'LegoBoost Controller';
      widget.title.closable = true;
      return widget;
    }
    let widget = newWidget();

    // Add an application command
    const command: string = 'apod:open';
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture',
      execute: () => {
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Tutorial' });
  }
};

const plugins: JupyterFrontEndPlugin<any>[] = [ConnectedDevicesPlugin, LegoBoostControlPlugin];
export default plugins;
