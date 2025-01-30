import { ColorSelector } from './ColorSelector';
import { DriveForm } from './DriveForm';
import { TurnForm } from './TurnForm';
import { MoveHub } from '../moveHub';
//import ManualControl from './ManualControl';
import { HubAsync } from '../moveHub/hub/hubAsync';
import { HeadRotationForm } from './HeadRotation';
import VernieComponent from './Vernie';
import ManualControl from './ManualControl';

interface IMoveHubPanel {
  device: MoveHub;
}

export interface IHubControlProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function VernieControlComponent({ device }: IMoveHubPanel) {
  return (
    <>
      <div className="vernie-control-container">
        <div>
          <DriveForm hub={device.hub} />
          <TurnForm hub={device.hub} />
          <HeadRotationForm
            hub={device.hub}
            dutyCycle={100}
            direction={'right'}
          />
          <HeadRotationForm
            hub={device.hub}
            dutyCycle={-100}
            direction={'left'}
          />
          <ColorSelector hub={device.hub} />
        </div>
        <div style={{display:"flex", justifyContent:"center", margin: "auto"}}>
          <div>
            <VernieComponent />
          </div>
          <div>
            <ManualControl moveHub={device} />
          </div>
        </div>
      </div>
    </>
  );
}
