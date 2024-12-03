import { MoveHubPanelModel } from './MoveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';

import { ColorSelector, colorValues } from './components/ColorSelector';
import { DriveForm } from './components/DriveForm';
import {TurnForm} from './components/TurnForm';
import { MoveHub } from './ConnectedDevice';

interface IMoveHubUI {
  connectedDevice: MoveHub;
}

export function MoveHubUI(props: IMoveHubUI) {
  return (
    <>
    <h2 className='lego-boost-panel-title'>Lego Boost control panel</h2>
      <ColorSelector
        hub={props.connectedDevice.hub}
        colorValues={colorValues}
      />
      <DriveForm hub={props.connectedDevice.hub} />
      <TurnForm hub={props.connectedDevice.hub}/>
    </>
  );
}

export class MoveHubPanelView extends VDomRenderer<MoveHubPanelModel> {
  public translator: ITranslator;
  public connectedDevice: MoveHub;

  constructor(model: MoveHubPanelModel, translator: ITranslator) {
    super(model);
    this.translator = translator;
    this.connectedDevice = model.connectedDevice;
  }

  render() {
    /*const trans = (this.translator ?? nullTranslator).load(
      'jupyter_theme_editor'
    );*/

    return (
      <>
        <MoveHubUI connectedDevice={this.connectedDevice}></MoveHubUI>
      </>
    );
  }
}
