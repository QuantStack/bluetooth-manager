// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IRunningSessionManagers, IRunningSessions } from '@jupyterlab/running';
import { ITranslator } from '@jupyterlab/translation';
import { Signal } from '@lumino/signaling';
import { BluetoothConnectIcon } from './icon';
import { CommandToolbarButton } from '@jupyterlab/ui-components';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { connect, disconnect } from './device';

namespace CommandIDs {
  export const connectDevice =
    'jupyterlab-web-bluetooth-manager:connect-device';
    export const disconnectDevice =
    'jupyterlab-web-bluetooth-manager:disconnect-device';
    export const alternativeDevice =
    'jupyterlab-web-bluetooth-manager:alternative-device';
}


/**
 * A class used to consolidate the signals used to rerender the connected devices section.
 */
class ConnectedDevicesSignaler {
  constructor(devicesList: Array<BluetoothDevice>) {
    this._devicesList = devicesList;
    this.devicesListChanged = new Signal<this, Array<any>>(this);
  }

  get devicesList(): Array<any> {
    return this._devicesList;
  }

  async connectDevice(): Promise<void> {
    const result = connect();
    result.then(device => {
      if (!this._devicesList.includes(device) && device.id) {
        this.addDeviceToList(device);
      }
    });
  }
  async disconnectDevice(device: BluetoothDevice, isConnected: boolean) {
    disconnect(device, isConnected);
    this.removeDeviceFromList(device);
  }

  // Method to add an item to the list
  addDeviceToList(item: BluetoothDevice): void {
    this._devicesList.push(item);
    // Emit the signal when the list changes

    this.devicesListChanged.emit(this._devicesList);
    console.warn(
      `A device is added and the list has ${this._devicesList.length} devices`
    );
  }

  // Method to remove an item from the list
  removeDeviceFromList(item: BluetoothDevice): void {
    console.log('before removing, the list of devices is:', this._devicesList);
    const index = this._devicesList.indexOf(item);
    if (index > -1) {
      this._devicesList.splice(index, 1);
      // Emit the signal when the list changes
      this.devicesListChanged.emit(this._devicesList);
    }
    console.warn(
      `A device is removed and the list has ${this._devicesList.length} devices`
    );
    console.warn('After removing, the list of devices is:', this._devicesList);
  }

  removeAllDevices() {
    this._devicesList.forEach((device, index) => {
      console.log(`device n°${index + 1} with deviceID ${device.id}`);
      disconnect(device, false);
      this.removeDeviceFromList(device);
      this.devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<BluetoothDevice>;
  public devicesListChanged;
}



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

  function test(node: HTMLElement): boolean {
    return node.className=== `.jp-RunningSessions-itemLabel`
  }
  app.commands.addCommand(CommandIDs.alternativeDevice, {
    execute: args => {
      if (test !== undefined) {
        const node = app.contextMenuHitTest(test);
        //if (node?.dataset.id) {
        //}
        
        //}
        console.log('node', node)
      }
    },
    caption: trans.__('Custom command to be set.'),
    label: trans.__('Custom command to be set')
  });



  app.contextMenu.addItem({
    command: CommandIDs.disconnectDevice,
    selector: `.jp-RunningSessions-itemLabel`,
    rank: 0
  });
  app.contextMenu.addItem({
    command: CommandIDs.alternativeDevice,
    selector: `.jp-RunningSessions-itemLabel`,
    rank: 0
  });
  commands.addCommand(CommandIDs.connectDevice, {
    execute: async args => {
      await signaler.connectDevice();
    },
    caption: trans.__('Connect device.')
  });

  commands.addCommand(CommandIDs.disconnectDevice, {
    execute: async args => {
      console.log('THIS IS THE DISCONNECT COMMAND')
    },
    caption: trans.__('Disconnect device.'),
    label: trans.__('Disconnect device.'),
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
  }
  readonly className: string;

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
