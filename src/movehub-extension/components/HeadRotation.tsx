import { useState } from 'react';
import { HubAsync } from '../moveHub/hub/hubAsync';
import InputField from './InputField';

export interface IHeadRotationFormProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type,
  dutyCycle: number;
  direction: string;


}

export function HeadRotationForm(props: IHeadRotationFormProps) {
  const [angle, setAngle] = useState("0");
  const hub = props.hub;



  function rotateHeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
      hub.motorAngle('D', Number(angle), props.dutyCycle, () => false);
  }


  return (
    <form onSubmit={rotateHeadSubmit}>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <h4> Head rotation to the {props.direction} (°)</h4>
        </div>
        <div className="move-input-field-with-button">
          <div>
            <InputField
              type="Angle"
              value={angle}
              onChange={setAngle}
              placeholder="Enter an angle (°)"
            />
          </div>
          <div>
            <button type="submit" className="move-validation-button">
             Turn {props.direction}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

