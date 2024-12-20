import { MoveHubPanelModel } from './MoveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';
import { ColorSelector, colorValues } from './components/ColorSelector'
import { DriveForm } from './components/DriveForm';
import { TurnForm } from './components/TurnForm';
import { MoveHub } from './moveHub';

interface IMoveHubUI {
  device: MoveHub;
}

export function MoveHubUI(props: IMoveHubUI) {
  return (
    <>
      <h2 className="lego-boost-panel-title">Lego Boost control panel</h2>
      <ColorSelector hub={props.device.hub} colorValues={colorValues} />
      <DriveForm hub={props.device.hub} />
      <TurnForm hub={props.device.hub} />
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
