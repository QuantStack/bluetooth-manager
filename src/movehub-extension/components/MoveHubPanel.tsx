import { ReactWidget } from '@jupyterlab/ui-components';
import { MoveHub } from '../moveHub';
import { HubAsync } from '../moveHub/hub/hubAsync';
import { DeviceInfoTable } from './DeviceInfoTable';
import { LegoBuildSpecific } from './LegoBuildSpecific';

export interface IMoveHubPanelProps {
  device: MoveHub;
}

export interface IHubControlProps {
  hub: HubAsync;
}

export function MoveHubInfos(props: { device: MoveHub }) {
  return <DeviceInfoTable moveHub={props.device} />;
}

export function MoveHubPanel({ device }: IMoveHubPanelProps) {
  return (
    <div>
      <LegoBuildSpecific device={device} />
      <MoveHubInfos device={device} />
    </div>
  );
}

export class MoveHubPanelWidget extends ReactWidget {
  public device: MoveHub;

  constructor(device: MoveHub) {
    super();
    this.device = device;
  }

  render() {
    return <MoveHubPanel device={this.device} />;
  }
}
