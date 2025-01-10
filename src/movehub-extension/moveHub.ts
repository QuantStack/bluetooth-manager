import { HubAsync } from './moveHub/hub/hubAsync';
import { BluetoothManager } from '../bluetooth/BluetoothManager';
import { HubControl } from './moveHub/ai/hub-control';
import { DeviceConfiguration, DEFAULT_CONFIG } from './moveHub/hub/hubAsync';
import { ControlData, DeviceInfo } from './moveHub/types';
import { moveHubCharacteristicUUID, moveHubServiceUUID } from '.';

export const defaultConfiguration: DeviceConfiguration = {
  distanceModifier: DEFAULT_CONFIG.METRIC_MODIFIER,
  turnModifier: DEFAULT_CONFIG.TURN_MODIFIER,
  defaultClearDistance: DEFAULT_CONFIG.DEFAULT_CLEAR_DISTANCE,
  defaultStopDistance: DEFAULT_CONFIG.DEFAULT_STOP_DISTANCE,
  leftMotor: DEFAULT_CONFIG.LEFT_MOTOR,
  rightMotor: DEFAULT_CONFIG.RIGHT_MOTOR,
  driveSpeed: DEFAULT_CONFIG.DRIVE_SPEED,
  turnSpeed: DEFAULT_CONFIG.TURN_SPEED
};

export const deviceInfo: DeviceInfo = {
  ports: {
    A: { action: '', angle: 0 },
    B: { action: '', angle: 0 },
    AB: { action: '', angle: 0 },
    C: { action: '', angle: 0 },
    D: { action: '', angle: 0 },
    LED: { action: '', angle: 0 }
  },
  tilt: { roll: 0, pitch: 0 },
  distance: Number.MAX_SAFE_INTEGER,
  rssi: 0,
  color: '',
  error: '',
  connected: false
};

/**
 * Input data to used on manual and AI control
 * @property MoveHub#controlData
 */
export const controlData: ControlData = {
  input: null,
  speed: 0,
  turnAngle: 0,
  tilt: { roll: 0, pitch: 0 },
  forceState: null,
  updateInputMode: (controlData: ControlData) => null,
  controlUpdateTime: undefined,
  state: undefined
};

export class MoveHub extends BluetoothManager.Device {
  public configuration: DeviceConfiguration;
  public hub: HubAsync;

  logDebug(message?: any, ...optionalParams: any[]): void {
    if (message) {
      //console.warn(message);
    } else return;
  }

  async initDevice(): Promise<MoveHub> {
    const characteristic = await this.getCharacteristic(
      this.native,
      moveHubServiceUUID,
      moveHubCharacteristicUUID
    );

    // Initialize hub
    if (characteristic !== undefined) {
      this.hub = new HubAsync(characteristic, defaultConfiguration);
      this.hub.logDebug = this.logDebug;

      // Register events
      // Ensure hub is fully configured before returning
      this.hub.emitter.on('connect', () => {
        this.hub.afterInitialization();
        const hubControl = new HubControl(
          deviceInfo,
          controlData,
          defaultConfiguration
        );
        hubControl.start(this.hub);

        setInterval(() => {
          hubControl.update();
        }, 100);
      });
    } else {
      console.warn('There is no characteristic available on this service.');
    }

    return this;
  }
}
