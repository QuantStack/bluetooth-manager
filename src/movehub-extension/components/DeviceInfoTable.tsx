import { useEffect, useState } from 'react';
import { Poll } from '@lumino/polling';
import { DeviceInfo } from '../moveHub/types';
import { defaultDeviceInfo, MoveHub } from '../moveHub';

export function DeviceInfoTable({ moveHub }: { moveHub: MoveHub }) {
  const [deviceState, setDeviceState] = useState<DeviceInfo>(defaultDeviceInfo);

  useEffect(() => {
    const poll = new Poll({
      auto: true,
      name: 'device-status-polling',
      factory: async () => {
        setDeviceState({ ...moveHub.deviceInfo });
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
  }, [moveHub.deviceInfo]);
  return (
    <>
      <table className="custom-table">
        <thead className="custom-table-thead">
          <tr className="custom-table-tr">
            <th className="custom-table-th"> </th>
            <th className="custom-table-th">Pitch</th>
            <th className="custom-table-th">Roll</th>
            <th className="custom-table-th">Yaw</th>
            <th className="custom-table-th">Distance</th>
            <th className="custom-table-th">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr className="custom-table-tr">
            <td className="custom-table-td" style={{ fontWeight: '600' }}>
              {'Sensors'}
            </td>
            <td className="custom-table-td">{deviceState.tilt.pitch} °</td>
            <td className="custom-table-td">{deviceState.tilt.roll} °</td>
            <td className="custom-table-td">{deviceState.tilt.yaw} °</td>
            <td className="custom-table-td">
              {deviceState.distance === Infinity
                ? 'Infinity'
                : `${deviceState.distance} mm`}
            </td>
            <td className="custom-table-td">{deviceState.color}</td>
          </tr>
        </tbody>
      </table>
      <table className="custom-table">
        <thead className="custom-table-thead">
          <tr className="custom-table-tr">
            <th className="custom-table-th"> </th>
            <th className="custom-table-th">Port A</th>
            <th className="custom-table-th">Port B</th>
            <th className="custom-table-th">Port AB</th>
            <th className="custom-table-th">Port C</th>
            <th className="custom-table-th">Port D</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="custom-table-td" style={{ fontWeight: '600' }}>
              {' '}
              Angle{' '}
            </td>
            <td className="custom-table-td">{deviceState.ports.A.value} °</td>
            <td className="custom-table-td">{deviceState.ports.B.value} °</td>
            <td className="custom-table-td">{deviceState.ports.AB.value} °</td>
            <td className="custom-table-td">{deviceState.ports.C.value} °</td>
            <td className="custom-table-td">{deviceState.ports.D.value} °</td>
          </tr>
          <tr className="custom-table-tr">
            <td className="custom-table-td" style={{ fontWeight: '600' }}>
              {' '}
              Action{' '}
            </td>
            <td className="custom-table-td">{deviceState.ports.A.action}</td>
            <td className="custom-table-td">{deviceState.ports.B.action}</td>
            <td className="custom-table-td">{deviceState.ports.AB.action}</td>
            <td className="custom-table-td">{deviceState.ports.C.action}</td>
            <td className="custom-table-td">{deviceState.ports.D.action}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
