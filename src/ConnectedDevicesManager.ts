// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IRunningSessionManagers, IRunningSessions } from '@jupyterlab/running';
import { ITranslator } from '@jupyterlab/translation';
import { BluetoothConnectIcon } from './icon';
import { CommandToolbarButton } from '@jupyterlab/ui-components';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ConnectedDevicesSignaler } from './ConnectedDevicesSignaler';
import { CommandIDs } from './commands';

/*function isAMoveHubDevice(node: HTMLElement): boolean {
  return node.textContent === 'LEGO Move Hub (mteUarXhCP6Dpe7oAQzgQA==)';
}*/

export function addConnectedDevicesManager(
  managers: IRunningSessionManagers,
  translator: ITranslator,
  app: JupyterFrontEnd
): void {
  const trans = translator.load('jupyterlab');
  const { commands } = app;
  const connectDeviceLabel = trans.__('Connect Device');
  let devicesList: Array<BluetoothDevice> = [];
  const signaler = new ConnectedDevicesSignaler(devicesList);
  let runningItemsList: Array<IRunningSessions.IRunningItem>;

  app.commands.addCommand(CommandIDs.alternativeDevice, {
    execute: args => {},
    caption: trans.__('Custom command to be set.'),
    label: trans.__('Custom command to be set')
  });

  app.contextMenu.addItem({
    command: CommandIDs.disconnectDevice,
    selector: `jp-tree-item.jp-RunningSessions-item`,
    rank: 0
  });

  app.contextMenu.addItem({
    command: CommandIDs.alternativeDevice,
    selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-Forerunner-35`,
    rank: 1
  }),
    app.contextMenu.addItem({
      command: CommandIDs.addLegoboostControllerPanel,
      selector: `jp-tree-item.jp-RunningSessions-item.jp-ConnectedDevice-Move-Hub`,
      rank: 1
    }),
    commands.addCommand(CommandIDs.connectDevice, {
      execute: async args => {
        await signaler.connectDevice(app);
      },
      caption: trans.__('Connect device.')
    });

  commands.addCommand(CommandIDs.disconnectDevice, {
    execute: async args => {},
    caption: trans.__('Disconnect device.'),
    label: trans.__('Disconnect device.')
  });

  managers.add({
    name: trans.__('Connected Devices'),
    supportsMultipleViews: false,
    running: () => {
      runningItemsList = [];
      devicesList.forEach(device => {
        runningItemsList.push(new ConnectedDevice(device, signaler));
      });
      return runningItemsList;
    },
    shutdownAll: () => {
      signaler.removeAllDevices();
    },
    refreshRunning: () => {
      return void 0;
    },
    runningChanged: signaler.devicesListChanged,
    shutdownLabel: trans.__('Disconnect'),
    shutdownAllLabel: trans.__('Disconnect All'),
    shutdownAllConfirmationText: trans.__(
      'Are you sure you want to disconnect all devices?'
    ),
    toolbarButtons: [
      new CommandToolbarButton({
        commands,
        id: CommandIDs.connectDevice,
        icon: BluetoothConnectIcon,
        caption: connectDeviceLabel,
        args: { toolbar: false }
      })
    ]
  });
}

class ConnectedDevice implements IRunningSessions.IRunningItem {
  constructor(device: BluetoothDevice, signaler: ConnectedDevicesSignaler) {
    this._device = device;
    this.signaler = signaler;
    if (this._device.name) {
      let deviceName = this._device.name;
      this.className = 'jp-ConnectedDevice-' + deviceName.replace(/\s+/g, '-');
    }
  }

  className?: string | undefined;

  icon() {
    return BluetoothConnectIcon;
  }
  label() {
    return this._device.name + ' (' + this._device.id + ')';
  }
  labelTitle() {
    return this._device.id;
  }

  shutdown() {
    this.signaler.disconnectDevice(this._device, false);
  }

  private _device: BluetoothDevice;
  public signaler: ConnectedDevicesSignaler;
}
