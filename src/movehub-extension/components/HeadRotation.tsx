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
          <h4> Port D: Rotation in {props.direction} sense (°)</h4>
          <p> Caution: for Vernie, port D angle must be within [-30°,90°] range</p>
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

