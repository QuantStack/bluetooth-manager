import { ColorSelector } from './ColorSelector';
import Vernie from './Vernie';
import { ManualControl, ManualControl1, ManualControl2, ManualControlBis} from './ManualControl';
import { IMoveHubPanelProps } from './MoveHubPanel';
import { MoveForm } from './MoveForm';

export function VernieComponent({ device }: IMoveHubPanelProps) {
  return (
    <>
      <div className="vernie-control-grid-container">

        <div className="vernie-control-grid-item-left">
          <Vernie />
        </div>
        <div className="vernie-control-grid-item-center">
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
            caution=""
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
          />
          <ColorSelector device={device} />
        </div>

        <div className="vernie-control-grid-item-right">
          <ManualControl moveHub={device} />
          <ManualControlBis moveHub={device} />
          <ManualControl1 moveHub={device}/>
          <ManualControl2 moveHub={device}/>
        </div>

      </div>
    </>
  );
}
