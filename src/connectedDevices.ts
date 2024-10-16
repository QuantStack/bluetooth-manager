// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

//import { ILabShell } from '@jupyterlab/application';
//import { DocumentWidget } from '@jupyterlab/docregistry';
import { IRunningSessionManagers, IRunningSessions } from '@jupyterlab/running';
import { ITranslator } from '@jupyterlab/translation';
import { ISignal, Signal } from '@lumino/signaling';
import { BluetoothPanelModel } from './model';
import LegoBoost from 'lego-boost-browser';
import { BluetoothIcon } from './icon';

/**
 * A class used to consolidate the signals used to rerender the connected devices section.
 */
class ConnectedDevicesSignaler {
  constructor(model: BluetoothPanelModel) {
    this._devicesList = model.devicesList;
  }

  /**
   * A signal that fires when the devices section should be rerendered.
   */
  get devicesListChanged(): ISignal<this, void> {
    console.log(this._devicesList);
    return this._devicesListChanged;
  }

  private _devicesListChanged = new Signal<this, void>(this);
  private _devicesList: Array<LegoBoost>;
}

/**
 * Add the connected devices section to the bluetooth device panel.
 *
 * @param managers - The IRunningSessionManagers used to register this section.
 * @param translator - The translator to use.
 * @param labShell - The ILabShell.
 */
export function addConnectecDevicesSessionManager(
  managers: IRunningSessionManagers,
  translator: ITranslator,
  model: BluetoothPanelModel
): void {
  const signaler = new ConnectedDevicesSignaler(model);
  const trans = translator.load('jupyterlab');
  
  managers.add({
    name: trans.__('Connected Devices'),
    running: () => {
      let list : Array<IRunningSessions.IRunningItem>=[]
      model.devicesList.forEach(device=>{
        list.push( new ConnectedDevice(device));
      })
      return list
    },
    shutdownAll: () => {
      console.log('Shutdown all');
    },
    refreshRunning: () => {
      return void 0;
    },
    runningChanged: signaler.devicesListChanged,
    shutdownLabel: trans.__('Disconnect'),
    shutdownAllLabel: trans.__('Disconnect All'),
    shutdownAllConfirmationText: trans.__(
      'Are you sure you want to disconnect all devices?'
    )
  });
}

class ConnectedDevice implements IRunningSessions.IRunningItem {
  constructor(device: LegoBoost) {
    this._device = device;
  }

  icon() {
    return BluetoothIcon;
  }
  label() {
    return this._device.deviceID;
  }

  private _device: LegoBoost;
}
