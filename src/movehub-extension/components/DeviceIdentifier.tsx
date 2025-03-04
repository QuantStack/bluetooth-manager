import { useEffect, useState } from 'react';
import { Poll } from '@lumino/polling';
import { DeviceInfo } from '../moveHub/types';
import { defaultDeviceInfo, MoveHub } from '../moveHub';
import { IMoveHubPanelProps } from './MoveHubPanel';
import { ReactWidget } from '@jupyterlab/ui-components';

export default function DeviceIdentifier({ device }: IMoveHubPanelProps) {
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

  return deviceState.connected === true ? (
    <div style={{ width: '200px', fontSize: '10px' }}>
      {'Device ID: ' + device.native.id}{' '}
    </div>
  ) : (
    <div style={{ width: '200px', fontSize: '10px' }}> </div>
  );
}

export class DeviceIdentifierWidget extends ReactWidget {
  public device: MoveHub;

  constructor(device: MoveHub) {
    super();
    this.device = device;
  }

  render() {
    return <DeviceIdentifier device={this.device} />;
  }
}
