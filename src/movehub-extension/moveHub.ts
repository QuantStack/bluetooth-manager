import { HubAsync } from './moveHub/hub/hubAsync';
import { BluetoothManager } from '../bluetooth/BluetoothManager';
import { getServicesFromDevice } from '../bluetooth-extension';
import { HubControl } from './moveHub/ai/hub-control';
import { DeviceConfiguration, DEFAULT_CONFIG } from './moveHub/hub/hubAsync';
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
    try {
      const services = await getServicesFromDevice(this.native); // Await services directly
      console.log('Services fetched:', services);

      if (!services || services.length === 0) {
        throw new Error('No services found on the device.');
      }
      console.log('Services fetched:', services);
      for (const service of services) {
        if (service.uuid === '00001623-1212-efde-1623-785feabcd123') {
          const characteristics = await service.getCharacteristic(
            '00001624-1212-efde-1623-785feabcd123'
          );
          if (!characteristics) {
            throw new Error(
              'Characteristics not found for the specified service.'
            );
          }
          console.log('Characteristics fetched:', characteristics);
          // Initialize hub
          this.hub = new HubAsync(characteristics, defaultConfiguration);
          this.hub.logDebug = this.logDebug;

          // Register events
          // Ensure hub is fully configured before returning
          await new Promise(resolve => {
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

              resolve(true); // Resolve only after hub is fully initialized
            });
          });
          break;
        }
  
      }

      return this;
    } catch (error) {
      console.error('Error during device initialization:', error);
      throw error; // Propagate the error for the caller to handle
    }
  }
}
