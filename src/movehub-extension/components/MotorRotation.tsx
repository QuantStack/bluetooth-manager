import { useState } from 'react';
import { HubAsync } from '../moveHub/hub/hubAsync';
import InputField from './InputField';

export interface IMotorRotationFormProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type,
  dutyCycle: number;
  direction: string;
}

export function MotorRotationForm(props: IMotorRotationFormProps) {
  const [angle, setAngle] = useState("0");
  const hub = props.hub;

  function rotateMotorSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
      hub.motorAngle('D', Number(angle), props.dutyCycle, () => false);
  }

  return (
    <form onSubmit={rotateMotorSubmit}>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <h4> Motor: Rotation in {props.direction} trigonometric sense (°)</h4>
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

