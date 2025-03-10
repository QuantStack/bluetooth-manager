import { ColorSelector } from './ColorSelector';
import Vernie from './Vernie';
import { ManualControl } from './ManualControl';
import { IMoveHubPanelWithThemeProps } from './MoveHubPanel';
import { MoveForm } from './MoveForm';

export function VernieComponent({ device, themeManager }: IMoveHubPanelWithThemeProps) {
  return (
    <>
      <div className="vernie-control-grid-container">
        <div className="vernie-control-grid-item-left">
          <Vernie themeManager={themeManager}/>
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
            moveHub={device}
            label={'Drive (cm) or turn (°)'}
            actionButton1="Drive"
            actionButton2="Turn"
            buttonText1={'Drive'}
            buttonText2={'Turn'}
            type={'distance/angle'}
            port={'AB'}
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
            build={'Vernie'}
          />
          <h4
            style={{
              color: 'var(--jp-accept-color-normal)',
              margin: '0',
              padding: '0'
            }}
          >
            Other motor(s)
          </h4>
          <p style={{ margin: '8px 0', fontWeight:"600"}}>Motor 1 on port D</p>
          <MoveForm
            moveHub={device}
            label={"Turn Vernie's head (°)"}
            actionButton1="RotateIndirect"
            actionButton2="RotateDirect"
            buttonText1={'Right'}
            buttonText2={'Left'}
            valueMin={-50}
            valueMax={140}
            type={'angle'}
            port={'D'}
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
            build={"Vernie"}
          />
          <p style={{ margin: '8px 0', fontWeight:"600"}}>Motor 2 on port C </p>
          <MoveForm
            moveHub={device}
            label={'Turn external motor'}
            actionButton1="RotateIndirect"
            actionButton2="RotateDirect"
            buttonText1={'Indirect'}
            buttonText2={'Direct'}
            type={'angle'}
            port={'C'}
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
            build={'Vernie'}
          />
          <ColorSelector device={device} />
        </div>

        <div className="vernie-control-grid-item-right">
          <ManualControl device={device} themeManager={themeManager}/>
        </div>
      </div>
    </>
  );
}
