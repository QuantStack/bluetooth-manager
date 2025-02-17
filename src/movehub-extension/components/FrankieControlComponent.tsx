import { ColorSelector } from './ColorSelector';
import FrankieComponent from './Frankie';
import { IMoveHubPanelProps } from '../moveHubPanelView';
import { MoveForm } from './MoveForm';

export function FrankieControlComponent({ device }: IMoveHubPanelProps) {
  return (
    <>
      <div className="vernie-control-grid-container">
        <div className="vernie-control-grid-item">
          <h4 style={{ color: 'var(--jp-accept-color-normal)', margin: '0', padding: '0' }}>
            Integrated motors
          </h4>
          <MoveForm
            hub={device.hub}
            label={'Wake up'}
            action={'Drive'}
            type={'distance'}
            buttonText={'Wake up'}
          />
          <MoveForm
            hub={device.hub}
            label={'Sit down'}
            action={'Drive'}
            type={'distance'}
            buttonText={'Sit down'}
          />
          <h4 style={{ color: 'var(--jp-accept-color-normal)', margin: '0', padding: '0' }}>
            Other motor
          </h4>
          <MoveForm
            hub={device.hub}
            label={`Move Frankie's tail to the left (°)`}
            action={'Rotate D direct'}
            buttonText={'Turn left'}
            type={'angle'}
            dutyCycle={-100}
            sense={'indirect'}
          />
          <MoveForm
            hub={device.hub}
            label={`Move Frankie's tail to the right (°)`}
            action={'Rotate D indirect'}
            buttonText={'Turn right'}
            type={'angle'}
            dutyCycle={100}
            sense={'indirect'}
          />
          <ColorSelector device={device} />
        </div>
        <div
          className="vernie-control-grid-item"
        >
          <FrankieComponent />
        </div>
      </div>
    </>
  );
}
