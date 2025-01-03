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
    <form onSubmit={turnSubmit} className="move-form">
      <h4>Turn by an angle (in degrees)</h4>
      <div className="move-input-with-button">
        <InputField
          type="angle"
          value={angle}
          onChange={setAngle}
          placeholder="Enter a angle (in degrees)"
        />
        <button className="move-validation-button" type="submit">
          Turn
        </button>
      </div>
    </form>
  );
}
