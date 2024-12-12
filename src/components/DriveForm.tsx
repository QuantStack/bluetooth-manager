import { useState } from 'react';
import { HubAsync } from '../movehub-extension/moveHub/hub/hubAsync';
import InputField from './InputField';


export interface IDriveFormProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
}

export function DriveForm (props: IDriveFormProps)  {
  const [distance, setDistance] = useState('0');
  const hub =  props.hub;

  const driveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted distance:', distance);
    hub.drive(Number(distance))
  };


  return (
    <form onSubmit={driveSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Enter a distance (in cm)</h3>

      <InputField
        type="Distance"
        value={distance}
        onChange={setDistance}
        placeholder="Enter a distance (in cm)"
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
        Drive
      </button>
    </form>
  );
}