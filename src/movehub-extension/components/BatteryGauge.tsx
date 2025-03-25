import { useEffect, useState } from 'react';
import { Poll } from '@lumino/polling';
import BatteryGauge from 'react-battery-gauge';
import { DeviceInfo } from '../moveHub/types';
import { defaultDeviceInfo, MoveHub } from '../moveHub';
import { IMoveHubPanelWithThemeProps } from './MoveHubPanel';
import { ReactWidget } from '@jupyterlab/ui-components';
import { IThemeManager } from '@jupyterlab/apputils';

const bodyStyle = {
  strokeWidth: 1,
  cornerRadius: 6,
  fill: 'none',
  strokeColor: '#111',
  width: '40px',
  padding: '0 8px'
};

const capStyle = {
  fill: 'none',
  strokeWidth: 1,
  strokeColor: '#111',
  cornerRadius: 2,
  capToBodyRatio: 0.4
};

const meterStyle = {
  fill: 'green',
  lowBatteryValue: 15,
  lowBatteryFill: 'red',
  outerGap: 1,
  noOfCells: 10, // more than 1, will create cell battery
  interCellsGap: 1
};

const textStyle = {
  lightContrastColor: '#111',
  darkContrastColor: '#fff',
  lowBatteryColor: 'red',
  fontFamily: 'Helvetica',
  fontSize: 30,
  showPercentage: true
};

export default function BatteryComponent({ device, themeManager }: IMoveHubPanelWithThemeProps) {
  const [deviceState, setDeviceState] = useState<DeviceInfo>(defaultDeviceInfo);

  useEffect(() => {
    const poll = new Poll({
      auto: true,
      name: 'device-status-polling',
      factory: async () => {
        setDeviceState({ ...device.deviceInfo });
      },
      frequency: {
        interval: 200,
        backoff: true
      },
      standby: 'when-hidden'
    });

    poll.start();

    return () => {
      poll.stop();
    };
  }, [device.deviceInfo]);

  return deviceState.batteryLevel !== undefined &&
    deviceState.connected === true ? (
    <BatteryGauge
      value={deviceState.batteryLevel}
      style={{
        ...bodyStyle,
        ...capStyle,
        ...meterStyle,
        ...textStyle
      }}
    />
  ) : (
    <div></div>
  );
}

export class BatteryWidget extends ReactWidget {
  public device: MoveHub;
  public themeManager: IThemeManager

  constructor(device: MoveHub) {
    super();
    this.device = device;
    this.themeManager = this.themeManager
  }

  render() {
    return <BatteryComponent device={this.device} themeManager={this.themeManager} />;
  }
}
