import { MoveHubPanelModel } from './MoveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';
import { ColorSelector } from './components/ColorSelector';
import { DriveForm } from './components/DriveForm';
import { TurnForm } from './components/TurnForm';
import { MoveHub } from './moveHub';
import VernieComponent from './components/Vernie';

interface IMoveHubUI {
  device: MoveHub;
}

export function MoveHubUI(props: IMoveHubUI) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
        <VernieComponent />
        <h2 className="lego-boost-vernie-panel-title">
          Vernie LEGO® Boost control panel
        </h2>
      </div>
      <div className="control-components-container">
        <div className="inputs_with_buttons_container">
          <DriveForm hub={props.device.hub} />
          <TurnForm hub={props.device.hub} />
        </div>
        <div>
          <ColorSelector hub={props.device.hub} />
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
