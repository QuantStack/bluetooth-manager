// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IRunningSessionManagers, IRunningSessions } from '@jupyterlab/running';
import { ITranslator } from '@jupyterlab/translation';
import { Signal } from '@lumino/signaling';
import LegoBoost from 'lego-boost-browser';
import { BluetoothConnectIcon /*BluetoothDisconnectIcon*/ } from './icon';
import { CommandToolbarButton } from '@jupyterlab/ui-components';
import { JupyterFrontEnd } from '@jupyterlab/application';

namespace CommandIDs {
  export const connectDevice =
    'jupyterlab-web-bluetooth-manager:connect-device';
}

/**
 * A class used to consolidate the signals used to rerender the connected devices section.
 */
class ConnectedDevicesSignaler {
  constructor(devicesList: Array<LegoBoost>) {
    this._devicesList = devicesList;
    this.devicesListChanged = new Signal<this, Array<LegoBoost>>(this);
  }

  get devicesList(): Array<LegoBoost> {
    return this._devicesList;
  }

  async connectDevice(): Promise<void> {
    const device = new LegoBoost();
    const result = device.connect();
    result.then(item => {
      if (!this._devicesList.includes(item) && device.deviceID) {
        this.addDeviceToList(device);
      }
    });
  }
  async disconnectDevice(device: LegoBoost) {
    device.disconnect();
    this.removeDeviceFromList(device);
  }

  // Method to add an item to the list
  addDeviceToList(item: LegoBoost): void {
    this._devicesList.push(item);
    // Emit the signal when the list changes

    this.devicesListChanged.emit(this._devicesList);
    console.warn(
      `A device is added and the list has ${this._devicesList.length} devices`
    );
  }

  // Method to remove an item from the list
  removeDeviceFromList(item: LegoBoost): void {
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
    console.log('After removing, the list of devices is:', this._devicesList);
  }

  removeAllDevices() {
    this._devicesList.forEach((device, index) => {
      console.log(`device n°${index + 1} with deviceID ${device.deviceID}`);
      device.disconnect();
      this.removeDeviceFromList(device);
      this.devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<LegoBoost>;
  public devicesListChanged;
}

export function addConnectecDevicesSessionManager(
  managers: IRunningSessionManagers,
  translator: ITranslator,
  app: JupyterFrontEnd
): void {
  const trans = translator.load('jupyterlab');
  const { commands } = app;
  const connectDeviceLabel = trans.__('Connect Device');
  let devicesList: Array<LegoBoost> = [];
  const signaler = new ConnectedDevicesSignaler(devicesList);
  let runningItemsList: Array<IRunningSessions.IRunningItem>;

  commands.addCommand(CommandIDs.connectDevice, {
    execute: async args => {
      await signaler.connectDevice();
    },
    caption: trans.__('Connect a device.')
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
  constructor(device: LegoBoost, signaler: ConnectedDevicesSignaler) {
    this._device = device;
    this.signaler = signaler;
  }
  readonly className: string;

  icon() {
    return BluetoothConnectIcon;
  }
  label() {
    return this._device.deviceName + ' (' + this._device.deviceID + ')';
  }
  labelTitle() {
    return this._device.deviceID;
  }

  shutdown() {
    this.signaler.disconnectDevice(this._device);
  }

  private _device: LegoBoost;
  public signaler: ConnectedDevicesSignaler;
}
