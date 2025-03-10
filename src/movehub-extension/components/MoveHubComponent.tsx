import MoveHub from './MoveHub';
import { IMoveHubPanelWithThemeProps } from './MoveHubPanel';
import { MoveForm } from './MoveForm';
import { ColorSelector } from './ColorSelector';



export function MoveHubComponent({ device, themeManager }: IMoveHubPanelWithThemeProps) {
  return (
    <>
      <div className="lego-build-control-grid-container">
        <div className="lego-build-control-grid-item-left">
          <MoveHub themeManager={themeManager} />
        </div>
        <div className="lego-build-control-grid-item-right">
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
            label={'Turn motors A et B (°)'}
            actionButton1={'RotateIndirect'}
            actionButton2={'RotateDirect'}
            buttonText1={'Indirect'}
            buttonText2={'Direct'}
            type={'angle'}
            port={'AB'}
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
            build={'MoveHub'}
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
            label={'Turn external motor'}
            actionButton1="RotateIndirect"
            actionButton2="RotateDirect"
            buttonText1={'Indirect'}
            buttonText2={'Direct'}
            type={'angle'}
            port={'D'}
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
            build={'MoveHub'}
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
            build={"MoveHub"}
          />
          <ColorSelector device={device} />
        </div>
      </div>
    </>
  );
}
