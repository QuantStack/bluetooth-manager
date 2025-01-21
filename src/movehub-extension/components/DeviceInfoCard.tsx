export interface portInfo {
  angle: number;
  action: string;
}

export interface IDeviceInfoDisplay {
  label: string;
  value: number | string | boolean;
  unity: string;
}

export interface IPortInfoDisplay {
  label: string;
  value: portInfo;
  unity: string;
}

export function DeviceInfoCard(props: IDeviceInfoDisplay) {
  return (
    <div className="device-info-card">
      <div className="info-card-label">
        <p>{props.label}</p>
      </div>
      <div className="info-card-value">
        {props.value !== Infinity ? (
          <p>
            {props.value} {props.unity}
          </p>
        ) : (
          <p>{props.value}</p>
        )}
      </div>
    </div>
  );
}

export function PortInfoCard(props: IPortInfoDisplay) {
  return (
    <div className="port-info-card">
      <div className="info-card-label">
        <p>{props.label}</p>
      </div>
      <div className="info-card-value">
        <p>Angle</p>
        <p>{props.value.angle}{props.unity}</p>
        <p>Action</p>
        <p>{props.value.action}</p>
      </div>
    </div>
  );
}
