import { useState } from 'react';
import { MoveHub } from '../moveHub';

export interface ICalibrationFormProps {
  moveHub: MoveHub
  label: string;
  buttonText1: string;
  unit?: string;
  updateRefPositionState: (newState: number)=>{}
}

export function CalibrationForm(props: ICalibrationFormProps) {
  const [refPosition, setRefPosition] = useState(0);

  function getFullFaceAsReferencePosition(moveHub: MoveHub) {
    const refPosition = Number(moveHub.deviceInfo.ports.D.value)
    setRefPosition(refPosition);
    props.updateRefPositionState(refPosition)
  }

  return (
    <div>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <p style={{ margin: '8px 0' }}>
            {props.label} {props.unit}
          </p>
        </div>

        <button
          className="calibration-validation-button"
          onClick={(event) => { getFullFaceAsReferencePosition(props.moveHub) }}
        >
          {props.buttonText1}
        </button>
        <div>{refPosition}</div>

      </div>
    </div>

  );
}
