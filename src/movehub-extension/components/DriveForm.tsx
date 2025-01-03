import { useState } from 'react';
import { HubAsync } from '../moveHub/hub/hubAsync';
import InputField from './InputField';

export interface IDriveFormProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function DriveForm(props: IDriveFormProps) {
  const [distance, setDistance] = useState('0');
  const hub = props.hub;

  const driveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    hub.drive(Number(distance));
  };

  return (
    <form onSubmit={driveSubmit} className="move-form">
      <h4>Move forward or backward (in cm)</h4>
      <div className="move-input-with-button">
        <InputField
          type="Distance"
          value={distance}
          onChange={setDistance}
          placeholder="Enter a distance (in cm)"
        />
        <button type="submit" className="move-validation-button">
          Drive
        </button>
      </div>
    </form>
  );
}
