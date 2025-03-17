import { useState } from 'react';
import { IMoveHubPanelProps } from './MoveHubPanel';
import { MoveHubComponent } from './MoveHubComponent';
import { VernieComponent } from './VernieComponent';
import { FrankieComponent } from './FrankieComponent';

export function LegoBuildSpecific({ device }: IMoveHubPanelProps) {
  const [legoBuild, setLegoBuild] = useState<any>('Move Hub');

  const renderSelectedComponent = () => {
    switch (legoBuild) {
      case 'Move Hub':
        return <MoveHubComponent device={device} />;
      case 'Vernie':
        return <VernieComponent device={device} />;
      case 'Frankie':
        return <FrankieComponent device={device} />;
      default:
        return <div>Pick a build from the toolbar dropdown.</div>;
    }
  };

  device.legoBuild.changed.connect(() => {
    const newLegoBuild = device.legoBuild.get();
    setLegoBuild(newLegoBuild);
  });

  return (
    <div>
      <div>{renderSelectedComponent()}</div>
    </div>
  );
}
