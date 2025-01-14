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
    <form onSubmit={driveSubmit}>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <h4>Move forward or backward (in cm)</h4>
        </div>
        <div className="move-input-field-with-button">
          <div>
            <InputField
              type="Distance"
              value={distance}
              onChange={setDistance}
              placeholder="Enter a distance (in cm)"
            />
          </div>
          <div>
            <button type="submit" className="move-validation-button">
              Drive
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
