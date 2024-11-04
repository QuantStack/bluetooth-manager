import {
  DeviceConfiguration,
  DEFAULT_CONFIG,
  HubAsync
} from './moveHub/hub/hubAsync';
import { HubControl } from './moveHub/ai/hub-control';
import { ControlData, DeviceInfo } from './moveHub/types';

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

const deviceInfo: DeviceInfo = {
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
const controlData: ControlData = {
  input: null,
  speed: 0,
  turnAngle: 0,
  tilt: { roll: 0, pitch: 0 },
  forceState: null,
  updateInputMode: (controlData: ControlData) => null,
  controlUpdateTime: undefined,
  state: undefined
};

function logDebug(message?: any, ...optionalParams: any[]): void {
  if (message) {
    console.warn(message);
  } else return;
}

export async function initHub(
  characteristics: BluetoothRemoteGATTCharacteristic,
  configuration: DeviceConfiguration = defaultConfiguration
) {
  const hub = new HubAsync(characteristics, configuration);
  hub.logDebug = logDebug;
  hub.emitter.on('disconnect', async evt => {
    console.warn('The hub got disconnected');
  });

  hub.emitter.on('connect', async evt => {
    hub.afterInitialization();
    await hub.ledAsync('white');
  });

  const hubControl = new HubControl(deviceInfo, controlData, configuration);
  await hubControl.start(hub);

  setInterval(() => {
    hubControl.update();
  }, 100);

  hub.drive(10)
}
