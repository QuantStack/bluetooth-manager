import { ColorSelector } from './ColorSelector';
import Vernie from './Vernie';
import { ManualControl } from './ManualControl';
import { IMoveHubPanelProps } from './MoveHubPanel';
import { MoveForm } from './MoveForm';

export function VernieComponent({ device }: IMoveHubPanelProps) {
  return (
    <>
      <div className="vernie-control-grid-container">
        <div className="vernie-control-grid-item-left">
          <h4
            style={{
              color: 'var(--jp-accept-color-normal)',
              margin: '0',
              padding: '0'
            }}
          >
            Integrated motors
          </h4>
          <MoveForm
            hub={device.hub}
            label={`Drive (cm) or turn (°)`}
            actionButton1="Drive"
            actionButton2="Turn"
            buttonText1={'Drive'}
            buttonText2={'Turn'}
            type={'distance/angle'}
            port={'AB'}
            caution=""
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
          />
          <h4
            style={{
              color: 'var(--jp-accept-color-normal)',
              margin: '0',
              padding: '0'
            }}
          >
            Other motor
          </h4>
          <MoveForm
            hub={device.hub}
            label={`Turn Vernie's head (°)`}
            actionButton1="RotateIndirect"
            actionButton2="RotateDirect"
            buttonText1={'Right'}
            buttonText2={'Left'}
            type={'angle'}
            port={'D'}
            caution="⚠ The angle for Port D should be in range: [0°, 110°]."
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
          />
          <ColorSelector device={device} />
        </div>
        <div className="vernie-control-grid-item-right">
          <Vernie />
        </div>

        <div className="vernie-control-grid-item-left">
          <ManualControl moveHub={device} />
        </div>
      </div>
    </>
  );
}
