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
  return (
    <>
      <div className="lego-movehub-infos-container">
        <DeviceInfoTable moveHub={props.device} />
      </div>
    </>
  );
}

export function MoveHubPanel({ device }: IMoveHubPanelProps) {
  return (
    <div>
      <MoveHubInfos device={device} />
      <LegoBuildSpecific device={device} />
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
