import MoveHub from './MoveHub';
import { IMoveHubPanelProps } from './MoveHubPanel';
import { HubAsync } from '../moveHub/hub/hubAsync';
import { MoveForm } from './MoveForm';
import { ColorSelector } from './ColorSelector';

export interface IHubControlProps {
  hub: HubAsync;
}

export function MoveHubComponent({ device }: IMoveHubPanelProps) {
  return (
    <>
      <div className="lego-build-control-grid-container">
        <div className="lego-build-control-grid-item-left">
          <MoveHub />
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
            hub={device.hub}
            label={'Turn motors A et B (°)'}
            actionButton1={'RotateIndirect'}
            actionButton2={'RotateDirect'}
            buttonText1={'Indirect'}
            buttonText2={'Direct'}
            type={'angle'}
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
            label={'Turn external motor'}
            actionButton1="RotateIndirect"
            actionButton2="RotateDirect"
            buttonText1={'Indirect'}
            buttonText2={'Direct'}
            type={'angle'}
            port={'D'}
            caution=""
            dutyCycleDirect={-100}
            dutyCycleIndirect={100}
          />
          <ColorSelector device={device} />
        </div>
      </div>
    </>
  );
}
