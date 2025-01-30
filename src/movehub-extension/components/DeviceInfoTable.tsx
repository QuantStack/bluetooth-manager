import { useEffect, useState } from 'react';
import { DeviceInfo } from '../moveHub/types';
import { defaultDeviceInfo, MoveHub } from '../moveHub';
import { Poll } from '@lumino/polling';

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
    <>
      <table className="custom-table">
        <thead className="custom-table-thead">
          <tr className="custom-table-tr">
            <th className="custom-table-th"> </th>
            <th className="custom-table-th">Pitch</th>
            <th className="custom-table-th">Roll</th>
            <th className="custom-table-th">Distance</th>
            <th className="custom-table-th">Color</th>
            <th className="custom-table-th">LED</th>
          </tr>
        </thead>
        <tbody>
          <tr className="custom-table-tr">
            <td className="custom-table-td" style={{ fontWeight: '600px' }}>
              {' '}
              Sensors/ LED{' '}
            </td>
            <td className="custom-table-td">{deviceState.tilt.pitch} °</td>
            <td className="custom-table-td">{deviceState.tilt.roll} °</td>
            <td className="custom-table-td">
              {deviceState.distance === Infinity
                ? 'Infinity'
                : `${deviceState.distance} mm`}
            </td>
            <td className="custom-table-td">{deviceState.color}</td>
            <td className="custom-table-td">not available</td>
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
            <td className="custom-table-td">{deviceState.ports.A.angle} °</td>
            <td className="custom-table-td">{deviceState.ports.B.angle} °</td>
            <td className="custom-table-td">{deviceState.ports.AB.angle} °</td>
            <td className="custom-table-td">{deviceState.ports.C.angle} °</td>
            <td className="custom-table-td">{deviceState.ports.D.angle} °</td>
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
