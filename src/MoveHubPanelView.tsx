import { MoveHubPanelModel } from './MoveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator /*nullTranslator*/ } from '@jupyterlab/translation';

import { ColorSelector, colorValues } from './components/ColorSelector';
import { DriveForm } from './components/DriveForm';
import {TurnForm} from './components/TurnForm';
import ConnectedDevice from './ConnectedDevice';

interface IMoveHubUI {
  connectedDevice: ConnectedDevice;
}

export function MoveHubUI(props: IMoveHubUI) {
  return (
    <>
    <h1 className='move-hub-panel-title'>Move hub control panel</h1>
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
  public connectedDevice: ConnectedDevice;

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
