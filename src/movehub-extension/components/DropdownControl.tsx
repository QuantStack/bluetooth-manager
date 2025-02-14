import React, { useState } from 'react';
import { MoveHub } from '../moveHub';
import { GenericControlComponent } from './GenericControlComponent';
import { VernieControlComponent } from './VernieControlComponent';
import { FrankieControlComponent } from './FrankieControlComponent';

interface IMoveHubPanel {
  device: MoveHub;
}


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
        return <GenericControlComponent device={device} />;
      case 'B':
        return <VernieControlComponent device={device} />;
      case 'C':
        return <FrankieControlComponent  device={device}/>;
      default:
        return <div>Select a control panel type from the dropdown.</div>;
    }
  };

  return (
    <div>
      <select
        className="custom-select"
        style={{marginTop:"-30px"}}
        onChange={handleDropdownChange}
        value={selectedComponent}
      >
        <option value="A">Generic</option>
        <option value="B">Vernie</option>
        <option value="C">Frankie The Cat</option>
      </select>
      <div>{renderSelectedComponent()}</div>
    </div>
  );
}
