import { useState } from 'react';
import { HubAsync } from '../moveHub/hub/hubAsync';
import InputField from './InputField';

export interface IMoveFormProps {
  hub: HubAsync;
  label: string;
  action: string;
  buttonText: string;
  unit?: string;
  type: string;
  dutyCycle?: number | undefined;
  sense?: string;
  port?: string;
}

export function MoveForm(props: IMoveFormProps) {
  const [inputValue, setInputValue] = useState('0');
  const hub = props.hub;

  const moveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (props.action) {
      case 'Drive':
        hub.drive(Number(inputValue));
      case 'Turn':
        hub.turn(Number(inputValue));
      case 'Rotate AB same':
        hub.motorAngleMultiAsync(Number(inputValue), 100, 100);

      case 'Rotate AB inverse':
        hub.motorAngleMultiAsync(Number(inputValue)), -100, -100;

      case 'Rotate D indirect':
        hub.motorAngle('D', Number(inputValue), 100, () => false);
      case 'Rotate D direct':
        hub.motorAngle('D', Number(inputValue), -100, () => false);
      default:
        console.error('This action is unknown');
    }
  };

  return (
    <form onSubmit={moveSubmit}>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <p style={{ margin: '8px 0' }}>
            {props.label} {props.unit}
          </p>
        </div>
        <div className="move-input-field-with-button">
          <div>
            <InputField
              type={props.type}
              value={inputValue}
              onChange={setInputValue}
              placeholder={props.action}
            />
          </div>
          <div>
            <button type="submit" className="move-validation-button">
              {props.buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
