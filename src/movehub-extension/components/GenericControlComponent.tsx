import { ColorSelector } from './ColorSelector';
import { HubAsync } from '../moveHub/hub/hubAsync';
import { MoveForm } from './MoveForm';
import { IMoveHubPanelProps } from '../moveHubPanelView';
export interface IHubControlProps {
  hub: HubAsync;
}

export function GenericControlComponent({ device }: IMoveHubPanelProps) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'left' }}>
        <div>
          <div>
          <h4 style={{ color: 'var(--jp-accept-color-normal)', margin:"0", padding:"0" }}>Integrated motors</h4>
            <MoveForm
              hub={device.hub}
              label={'Turn motors A and B in the same sense (°)'}
              action={'Rotate same'}
              type={'angle'}
              buttonText={'Rotate'}
            />
            <MoveForm
              hub={device.hub}
              label={'Turn motors A and B in opposite sense (°)'}
              action={'Rotate inverse'}
              type={'angle'}
              buttonText={'Rotate'}
            />
            <h4 style={{ color: 'var(--jp-accept-color-normal)', margin:"0", padding:"0" }}>Other motor</h4>
            <MoveForm
              hub={device.hub}
              label={`Rotate in direct trigonometric sense (°)`}
              action={'Rotate D direct'}
              buttonText={'Rotate'}
              type={'angle'}
              dutyCycle={-100}
              sense={'direct'}
            />
            <MoveForm
              hub={device.hub}
              label={`Rotate in indirect trigonometric sense (°)`}
              action={'Rotate D indirect'}
              buttonText={'Rotate'}
              type={'angle'}
              dutyCycle={100}
              sense={'indirect'}
            />
            <ColorSelector device={device} />
          </div>
        </div>
      </div>
    </>
  );
}
