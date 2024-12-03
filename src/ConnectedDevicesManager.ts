import { JupyterFrontEnd } from '@jupyterlab/application';
import ConnectedDevice from './ConnectedDevice';
import { Signal } from '@lumino/signaling';
import { MoveHub, SmartWatch, LightBulb, Loudspeaker } from './ConnectedDevice';
import { Service, servicesDict } from './services';
import {
  MoveHubNamesRegistry,
  LightBulbNamesRegistry,
  LoudspeakerNamesRegistry,
  SmartWatchNamesRegistry
} from './devicesRegistries';

export function getServicesFromDict(servicesDict: Record<string, Service>) {
  const serviceUUIDs = Object.values(servicesDict).map(
    (service: Service) => service.serviceUUID
  );
  return serviceUUIDs;
}

export function buildUniqueIdentifier(connectDevice: ConnectedDevice) {
  return (
    connectDevice.bluetoothDevice.name?.replace(/\s+/g, '-') +
    '-' +
    connectDevice.bluetoothDevice.id
  );
}

const optionalServices = getServicesFromDict(servicesDict);

/**
 * A class used to update the list of connected device and related signals used to rerender the connected devices section.
 */
export class ConnectedDevicesManager {
  constructor(devicesList: Array<ConnectedDevice>) {
    this._devicesList = devicesList;
    this.devicesListChanged = new Signal<this, Array<ConnectedDevice>>(this);
    this.justAddedAMoveHub = new Signal<this, MoveHub>(this);
    this.justAddedALightBulb = new Signal<this, LightBulb>(this);
    this.justAddedASmartWatch = new Signal<this, SmartWatch>(this);
    this.justAddedALoudspeaker = new Signal<this, Loudspeaker>(this);
    this.identifiersRegistry = [];
  }

  get devicesList(): Array<ConnectedDevice | MoveHub | LightBulb | SmartWatch> {
    return this._devicesList;
  }
  private async createDevice(): Promise<ConnectedDevice> {
    const options = {
      acceptAllDevices: true,
      /*filters: [{ services: [MOVE_HUB_SERVICE_UUID] }],*/
      optionalServices: optionalServices
    };
    console.warn('Create device call');
    this.bluetoothDevice = await navigator.bluetooth.requestDevice(options);
    console.warn('Create device call after');
    if (this.bluetoothDevice.name) {
      if (MoveHubNamesRegistry.includes(this.bluetoothDevice.name)) {
        return new MoveHub();
      } else if (LightBulbNamesRegistry.includes(this.bluetoothDevice.name)) {
        return new LightBulb();
      } else if (SmartWatchNamesRegistry.includes(this.bluetoothDevice.name)) {
        return new SmartWatch();
      } else if (LoudspeakerNamesRegistry.includes(this.bluetoothDevice.name)) {
        return new Loudspeaker();
      }
    } else console.warn('The device has no name');
    return new ConnectedDevice(); // Fallback to generic device
  }

  async connectDevice(app: JupyterFrontEnd): Promise<void> {
    const connectedDevice = await this.createDevice();
    connectedDevice.connect(this.bluetoothDevice);
    const identifier = buildUniqueIdentifier(connectedDevice);
    if (this.identifiersRegistry.includes(identifier)) {
      console.warn('The device is already in the list of devices');
    } else {
      this.addDeviceToList(connectedDevice);
      this.identifiersRegistry.push(identifier);
      console.log('identifiersRegistry:', this.identifiersRegistry);

      if (connectedDevice instanceof MoveHub) {
        console.warn('The added device is a Move Hub.');
        this.justAddedAMoveHub.emit(connectedDevice);
      }

      if (connectedDevice instanceof SmartWatch) {
        console.warn('The added device is a SmartWatch.');
        this.justAddedASmartWatch.emit(connectedDevice);
      }

      if (connectedDevice instanceof LightBulb) {
        console.warn('The added device is a Light Bulb.');
        this.justAddedALightBulb.emit(connectedDevice);
      }

      if (connectedDevice instanceof Loudspeaker) {
        console.warn('The added device is a Loudspeaker.');
        this.justAddedALoudspeaker.emit(connectedDevice);
      }
    }
  }

  async disconnectDevice(connectedDevice: ConnectedDevice): Promise<void> {
    connectedDevice.disconnect();
    this.removeDeviceFromList(connectedDevice);
  }

  // Method to add an item to the list
  addDeviceToList(connectDevice: ConnectedDevice): void {
    this._devicesList.push(connectDevice);
    // Emit the signal when the list changes

    this.devicesListChanged.emit(this._devicesList);
    console.warn(
      `A device is added and the list has ${this._devicesList.length} devices`
    );
  }

  // Method to remove an item from the list
  removeDeviceFromList(connectedDevice: ConnectedDevice): void {
    console.log('Before removing, the list of devices is:', this._devicesList);
    const index = this._devicesList.indexOf(connectedDevice);
    if (index > -1) {
      this._devicesList.splice(index, 1);
      this.identifiersRegistry.splice(index, 1);
      // Emit the signal when the list changes
      this.devicesListChanged.emit(this._devicesList);
    }
    console.warn(
      `A device is removed and the list has ${this._devicesList.length} devices`
    );
    console.warn('After removing, the list of devices is:', this._devicesList);
    console.log(
      'After removing, identifiersRegistry:',
      this.identifiersRegistry
    );
  }

  removeAllDevices() {
    this._devicesList.forEach((connectedDevice, index) => {
      console.log(
        `device n°${index + 1} with deviceID ${connectedDevice.bluetoothDevice.id}`
      );
      connectedDevice.disconnect();
      this.removeDeviceFromList(connectedDevice);
      this.devicesListChanged.emit(this._devicesList);
    });
  }
  private _devicesList: Array<ConnectedDevice>;
  public devicesListChanged;
  public justAddedAMoveHub;
  public justAddedALightBulb;
  public justAddedASmartWatch;
  public justAddedALoudspeaker;
  private bluetoothDevice: BluetoothDevice;
  public identifiersRegistry: Array<string | undefined>;
}
