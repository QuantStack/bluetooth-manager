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
      <table className="jp-RenderedHTMLCommon table">
        <thead>
          <tr className="jp-RenderedHTMLCommon tr">
          <th className="jp-RenderedHTMLCommon td"> </th>
            <th className="jp-RenderedHTMLCommon td">Pitch</th>
            <th className="jp-RenderedHTMLCommon td">Roll</th>
            <th className="jp-RenderedHTMLCommon td">Distance</th>
            <th className="jp-RenderedHTMLCommon td">Color</th>
            <th className="jp-RenderedHTMLCommon td">LED</th>
          </tr>
        </thead>
        <tbody>
          <tr className="jp-RenderedHTMLCommon tr">
          <td className="jp-RenderedHTMLCommon td" style={{fontWeight:"600px"}}> Sensors/ LED </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.tilt.pitch} °
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.tilt.roll} °
            </td>
            <td className="jp-RenderedHTMLCommon td">{deviceState.distance} mm</td>
            <td className="jp-RenderedHTMLCommon td">{deviceState.color}</td>
            <td className="jp-RenderedHTMLCommon td">
              not available
            </td>
          </tr>
        </tbody>
      </table>
      <table className="jp-RenderedHTMLCommon table">
        <thead>
          <tr>
          <th className="jp-RenderedHTMLCommon td">  </th>
            <th className="jp-RenderedHTMLCommon td">Port A</th>
            <th className="jp-RenderedHTMLCommon td">Port B</th>
            <th className="jp-RenderedHTMLCommon td">Port AB</th>
            <th className="jp-RenderedHTMLCommon td">Port C</th>
            <th className="jp-RenderedHTMLCommon td">Port D</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          <td className="jp-RenderedHTMLCommon td" style={{fontWeight:"600px"}}> Angle </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.A.angle} °
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.B.angle} °
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.AB.angle} °
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.C.angle} °
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.D.angle} °
            </td>
          </tr>
          <tr className="jp-RenderedHTMLCommon tr">
          <td className="jp-RenderedHTMLCommon td" style={{fontWeight:"600px"}}> Action </td>
            <td className="jp-RenderedHTMLCommon">
              {deviceState.ports.A.action}
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.B.action}
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.AB.action}
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.C.action}
            </td>
            <td className="jp-RenderedHTMLCommon td">
              {deviceState.ports.D.action}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
