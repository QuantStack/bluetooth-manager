import React, { useState } from 'react';
import { MoveHub } from '../moveHub';
import { GenericControlComponent } from './GenericControlComponent';
import { VernieControlComponent } from './VernieControlComponent';

interface IMoveHubPanel {
  device: MoveHub;
}

const ComponentC = () => <div>Guitar 4000</div>;
const ComponentD = () => <div>Frankie The Cat</div>;
const ComponentE = () => <div>AutoBuilder</div>;
const ComponentF = () => <div>M.T.R. 4</div>;

export function DropdownComponent({ device }: IMoveHubPanel) {
  const [selectedComponent, setSelectedComponent] = useState<string>('A');

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedComponent(event.target.value);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'A':
        return <VernieControlComponent device={device} />;
      case 'B':
        return <GenericControlComponent device={device} />;
      case 'C':
        return <ComponentC />;
      case 'D':
        return <ComponentD />;
      case 'E':
        return <ComponentE />;
      case 'F':
        return <ComponentF />;
      default:
        return <div>Select a control panel type from the dropdown.</div>;
    }
  };

  return (
    <div>
      <select className="custom-select" onChange={handleDropdownChange} value={selectedComponent}>
        <option value="A">Vernie</option>
        <option value="B">Generic</option>
        <option value="C">Guitar4000</option>
        <option value="D">Frankie The Cat</option>
        <option value="E">AutoBuilder</option>
        <option value="F">M.T.R.4</option>
      </select>
      <div>{renderSelectedComponent()}</div>
    </div>
  );
}
