import { MoveHubPanelModel } from './moveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';
import { MoveHub } from './moveHub';
import { HubAsync } from './moveHub/hub/hubAsync';
import { DeviceInfoTable } from './components/DeviceInfoTable';
import { DropdownComponent } from './components/DropdownControl';

export interface IMoveHubPanel {
  device: MoveHub;
}

export interface IHubControlProps {
  hub: HubAsync; 
}

export function MoveHubInfos(props: { device: MoveHub }) {
  return (
    <>
      <div className="lego-movehub-infos-container">
        <h2 className="lego-movehub-panel-title">
          LEGO® Move Hub control panel
        </h2>
      </div>
      <div className="lego-movehub-infos-container">
        <h3 style={{ color: '  var(--jp-accept-color-normal)' }}>Move Hub real-time informations</h3>
        <DeviceInfoTable moveHub={props.device} />
      </div>
    </>
  );
}

export function MoveHubPanel({ device }: IMoveHubPanel) {
  return (
    <div>
      <MoveHubInfos device={device} />
      <DropdownComponent device={device} />
    </div>
  );
}

export class MoveHubPanelView extends VDomRenderer<MoveHubPanelModel> {
  public translator: ITranslator;
  public device: MoveHub;

  constructor(model: MoveHubPanelModel, translator: ITranslator) {
    super(model);
    this.translator = translator;
    this.device = model.device;
  }

  render() {
    /*const trans = (this.translator ?? nullTranslator).load(
      'jupyter_theme_editor'
    );*/

    return <MoveHubPanel device={this.device} />;
  }
}
