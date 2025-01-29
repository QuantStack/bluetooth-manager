import { MoveHubPanelModel } from './moveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';
import { ColorSelector } from './components/ColorSelector';
import { DriveForm } from './components/DriveForm';
import { TurnForm } from './components/TurnForm';
import { MoveHub } from './moveHub';
//import VernieComponent from './components/Vernie';
import ManualControl from './components/ManualControl';
import { HubAsync } from './moveHub/hub/hubAsync';
//import { Hub } from './moveHub/hub/hub';
import { HeadRotationForm } from './components/HeadRotation';
import { DeviceInfoTable } from './components/DeviceInfoTable';

interface IMoveHubPanel {
  device: MoveHub;
}

export interface IHubControlProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function MoveHubPanel(props: IMoveHubPanel) {
  return (
    <>
      <div className="lego-movehub-panel-main-container">
        <h2 className="lego-movehub-panel-title">
          LEGO® Move Hub control panel
        </h2>
      </div>
      <div className="lego-movehub-info-container">
        <h3 style={{ color: '  #007bff' }}>Move Hub real-time informations</h3>
        <DeviceInfoTable moveHub={props.device} />
      </div>

      <div className="lego-movehub-manual-control">
        <div className="inputs-with-buttons-container">
          <h3 style={{ color: ' #007bff' }}>Move hub manual input control</h3>
          <div className="left-column">
            <DriveForm hub={props.device.hub} />
            <TurnForm hub={props.device.hub} />
            <HeadRotationForm
              hub={props.device.hub}
              dutyCycle={100}
              direction={'clockwise'}
            />
            <HeadRotationForm
              hub={props.device.hub}
              dutyCycle={-100}
              direction={'counter-clockwise'}
            />
            <ColorSelector hub={props.device.hub} />
          </div>
        </div>

        <div className="right-column">
          <div>
            <ManualControl moveHub={props.device} />
          </div>
        </div>
      </div>
    </>
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

    return (
      <>
        <MoveHubPanel device={this.device} />
      </>
    );
  }
}
