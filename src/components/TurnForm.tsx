import { useState } from 'react';
import { HubAsync } from '../movehub-extension/moveHub/hub/hubAsync';
import InputField from './InputField';


export interface ITurnFormProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function TurnForm (props: ITurnFormProps)  {
  const [angle, setAngle] = useState('0');
  const hub =  props.hub;

  const turnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted angle:', angle);
    hub.turn(Number(angle))
  };


  return (
    <form onSubmit={turnSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Enter an angle (in degrees)</h3>

      <InputField
        type="angle"
        value={angle}
        onChange={setAngle}
        placeholder="Enter a angle (in degrees)"
      />
      <button
        type="submit"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Turn
      </button>
    </form>
  );
}