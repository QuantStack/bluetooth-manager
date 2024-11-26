import { MoveHubPanelModel } from './MoveHubPanelModel';
import { VDomRenderer } from '@jupyterlab/ui-components';
import { ITranslator, /*nullTranslator*/ } from '@jupyterlab/translation';
import ColorPicker from './colorSelector';
import { HubAsync } from './moveHub/hub/hubAsync';

const colorOptions = [
  '#cecece',
  '#ffc0cb',
  '#800080',
  '#0000ff',
  '#00ffff',
  '#008000',
  '#ffff00',
  '#ed7f10',
  '#f00020',
  '#ffffff'
];

export class MoveHubPanelView extends VDomRenderer<MoveHubPanelModel> {
  public translator: ITranslator;
  public hub: HubAsync;

  constructor(model: MoveHubPanelModel, translator: ITranslator) {
    super(model);
    this.translator = translator;
    this.hub = model.connectedDevice.hub
  }

  render() {
    /*const trans = (this.translator ?? nullTranslator).load(
      'jupyter_theme_editor'
    );*/

    return (
      <>
        <div>
          <ColorPicker
            hub={this.hub}
            colorOptions={colorOptions}
          ></ColorPicker>
        </div>
      </>
    );
  }
}
