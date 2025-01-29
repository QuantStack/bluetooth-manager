import { defaultDeviceInfo, MoveHub } from '../moveHub';
import { useEffect, useState } from 'react';
import { DeviceInfo } from '../moveHub/types';
import { DeviceInfoCard, PortInfoCard } from './DeviceInfoCard';
import { Poll } from '@lumino/polling';

export function DeviceStatus({ moveHub }: { moveHub: MoveHub }) {
  const [deviceState, setDeviceState] = useState<DeviceInfo>(defaultDeviceInfo);

  useEffect(() => {
    const poll = new Poll({
      auto: true,
      name: 'device-status-polling',
      factory: async () => {
        setDeviceState({...moveHub.deviceInfo});
      },
      frequency: {
        interval: 16,
        backoff: true
      },
      standby: 'when-hidden'
    });

    poll.start();

    return () => {
      poll.stop();
    };
  }, [moveHub.deviceInfo]);

  return (
    <div>
      <div className="info-card-grid">
        <DeviceInfoCard
          label={'Pitch'}
          value={deviceState.tilt.pitch}
          unity={'°'}
        />
        <DeviceInfoCard
          label={'Roll'}
          value={deviceState.tilt.roll}
          unity={'°'}
        />
        <DeviceInfoCard
          label={'Distance'}
          value={deviceState.distance}
          unity={'mm'}
        />
        <DeviceInfoCard label={'Color'} value={deviceState.color} unity={''} />
      </div>
      <div className="info-card-grid">
        <PortInfoCard
          label={'Port A'}
          value={deviceState.ports.A}
          unity={'°'}
        />
        <PortInfoCard
          label={'Port B'}
          value={deviceState.ports.B}
          unity={'°'}
        />
        <PortInfoCard
          label={'Port AB'}
          value={deviceState.ports.AB}
          unity={'°'}
        />
        <PortInfoCard label={'Port C'} value={deviceState.ports.C} unity={''} />
        <PortInfoCard
          label={'Port D'}
          value={deviceState.ports.D}
          unity={'°'}
        />
        <PortInfoCard label={'LED'} value={deviceState.ports.LED} unity={''} />
      </div>
    </div>
  );
}
