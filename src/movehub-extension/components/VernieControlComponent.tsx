import { ColorSelector } from './ColorSelector';
import VernieComponent from './Vernie';
import ManualControl from './ManualControl';
import { IMoveHubPanelProps } from '../moveHubPanelView';
import { MoveForm } from './MoveForm';

export function VernieControlComponent({ device }: IMoveHubPanelProps) {
  return (
    <>
      <div className="vernie-control-grid-container">
        <div className="vernie-control-grid-item">
          <h4 style={{ color: 'var(--jp-accept-color-normal)', margin: '0', padding: '0' }}>
            Integrated motors
          </h4>
          <MoveForm
            hub={device.hub}
            label={'Move forward or backward (in cm)'}
            action={'Drive'}
            type={'distance'}
            buttonText={'Drive'}
          />
          <MoveForm
            hub={device.hub}
            label={'Turn by an angle (in °)'}
            action={'Turn'}
            type={'angle'}
            buttonText={'Turn'}
          />
          <h4 style={{ color: 'var(--jp-accept-color-normal)', margin: '0', padding: '0' }}>
            Other motor
          </h4>
          <MoveForm
            hub={device.hub}
            label={`Rotate Vernie's head to the left (°)`}
            action={'Rotate D direct'}
            buttonText={'Turn left'}
            type={'angle'}
            dutyCycle={-100}
            sense={'indirect'}
          />
          <MoveForm
            hub={device.hub}
            label={`Rotate Vernie's head to the right (°)`}
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
          <VernieComponent />
        </div>
       
        <div className="vernie-control-grid-item">
          <h4 style={{ color: 'var(--jp-accept-color-normal)', margin: '0', padding: '0' }}>
            Use the set of buttons to control Vernie's displacements
          </h4>
          <p style={{ margin: '8px 0', width:"250px" }} >
            Click on the up/down arrow to drive Vernie in a continuous
            inward/backward displacement
          </p>
          <p style={{ margin: '8px 0', width:"250px"  }}>
            Click on the left/right arrow to produce a left/right quarter turn{' '}
          </p>
        </div>
        <div
          className="vernie-control-grid-item"
        >
          <ManualControl moveHub={device} />
        </div>
      </div>
    </>
  );
}
