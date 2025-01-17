import { MoveHubPanelModel } from './MoveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';
import { ColorSelector } from './components/ColorSelector';
import { DriveForm } from './components/DriveForm';
import { TurnForm } from './components/TurnForm';
import { MoveHub } from './moveHub';
import VernieComponent from './components/Vernie';
import ManualControl from './components/ManualControl';
import { HubAsync } from './moveHub/hub/hubAsync';

interface IMoveHubUI {
  device: MoveHub;
}

export interface IHubControlProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function MoveHubUI(props: IMoveHubUI) {
  return (
    <>
      <div className="movehub-ui-main-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem'
          }}
        >
          <h2 className="lego-boost-vernie-panel-title">
            Vernie LEGO® Boost control panel
          </h2>
          <VernieComponent />
        </div>
      </div>
      <div className="control-components-container">
        <div className="left-column">
          <div className="inputs-with-buttons-container">
            <DriveForm hub={props.device.hub} />
            <TurnForm hub={props.device.hub} />
            <ColorSelector hub={props.device.hub} />
          </div>
        </div>
        <div className="right-column">
          <div>
            <ManualControl moveHub={props.device}/>
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
        <MoveHubUI device={this.device} />
      </>
    );
  }
}
