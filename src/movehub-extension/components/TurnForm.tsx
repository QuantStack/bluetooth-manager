import { useState } from 'react';
import { HubAsync } from '../moveHub/hub/hubAsync';
import InputField from './InputField';

export interface ITurnFormProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function TurnForm(props: ITurnFormProps) {
  const [angle, setAngle] = useState('0');
  const hub = props.hub;

  const turnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted angle:', angle);
    hub.turn(Number(angle));
  };

  return (
    <form onSubmit={turnSubmit}>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <h4>Turn by an angle (in degrees)</h4>
        </div>
        <div className="move-input-field-with-button">
          <div>
            <InputField
              type="angle"
              value={angle}
              onChange={setAngle}
              placeholder="Enter a angle (in degrees)"
            />
          </div>
          <div>
            <button className="move-validation-button" type="submit">
              Turn
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
