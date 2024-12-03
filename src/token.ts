import { Token } from '@lumino/coreutils';
import ConnectedDevice from './ConnectedDevice';
import { Signal } from '@lumino/signaling';
import { JupyterFrontEnd } from '@jupyterlab/application';

/**
 * The connected devices manager token.
 */
export const IConnectedDevicesManager = new Token<IConnectedDevicesManager>(
  'bluetooh-manager/connected-devices-plugin:IConnectedDevices',
  `A service for managing the connection and the list of devices connected by web bluetooth.`
);

/**
 * The interface for the connected devices manager.
 */
export interface IConnectedDevicesManager {
  devicesListChanged: Signal<IConnectedDevicesManager, Array<ConnectedDevice>>;
  justAddedAMoveHub: Signal<IConnectedDevicesManager, ConnectedDevice>;
  connectDevice(app: JupyterFrontEnd): Promise<void>;
  disconnectDevice(connectedDevice: ConnectedDevice): Promise<void>;
  addDeviceToList(connectedDevice: ConnectedDevice): void;
  removeDeviceFromList(connectedDevice: ConnectedDevice): void;
}
