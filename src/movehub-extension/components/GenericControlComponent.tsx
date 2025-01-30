import { ColorSelector } from './ColorSelector';
import { DriveForm } from './DriveForm';
import { TurnForm } from './TurnForm';
import { MoveHub } from '../moveHub';
import ManualControl from './ManualControl';
import { HubAsync } from '../moveHub/hub/hubAsync';
import { MotorRotationForm } from './MotorRotation';

interface IMoveHubPanel {
  device: MoveHub;
}

export interface IHubControlProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function GenericControlComponent({ device }: IMoveHubPanel) {
  return (
    <>
      <div className="lego-movehub-manual-control">
        <div className="vernie-control-column">
          <div>
            <DriveForm hub={device.hub} />
            <TurnForm hub={device.hub} />
            <MotorRotationForm
              hub={device.hub}
              dutyCycle={100}
              direction={'indirect'}
            />
            <MotorRotationForm
              hub={device.hub}
              dutyCycle={-100}
              direction={'direct'}
            />
            <ColorSelector hub={device.hub} />
          </div>
        </div>

        <div className="vernie-control-column">
          <div>
            <ManualControl moveHub={device} />
          </div>
        </div>
      </div>
    </>
  );
}
