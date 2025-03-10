import { useState } from 'react';
import InputField from './InputField';
import { MoveHub } from '../moveHub';

export interface IMoveFormProps {
  moveHub: MoveHub
  label: string;
  actionButton1: string;
  actionButton2: string;
  buttonText1: string;
  buttonText2: string;
  type: string;
  build: string;
  unit?: string;
  port: string;
  valueMin?: number;
  valueMax?: number;
  dutyCycleDirect: number
  dutyCycleIndirect: number /*dutyCycle: motor power percentage from `-100` to `100`. If a negative value is given rotation is counterclockwise or direct*/
}

export function MoveForm(props: IMoveFormProps) {
  const [inputValue, setInputValue] = useState('0');
  const hub = props.moveHub.hub
  
  const checkInputValue = (inputValue: number, currentValue: number, sense: string, valueMin?: number, valueMax?: number): boolean => {
    
    if (sense === 'direct') {
      console.log('current value:', currentValue)
      const minReachedValue = currentValue - inputValue;
      console.log('minReachedValue,', minReachedValue);
      if (valueMin && minReachedValue < valueMin) {
        console.error("Out of valid range for Vernie's build")
        return false
      }
      else {
        currentValue = minReachedValue;
        return true
      }
    }
    else if (sense === 'indirect') {
      console.log('current value:', currentValue)
      const maxReachedValue = currentValue + inputValue;
      console.log('maxReachedValue,', maxReachedValue);
      if (valueMax && maxReachedValue > valueMax) {
        console.error("Out of valid range for Vernie's build")
        return false;
      }
      else {
        currentValue = maxReachedValue;
        return true
      }
    }
    else {
      console.error('Sense must me provided as direct or indirect.')
      return false
    }
  }
  const selectMove = (action: string) => {

    return () => {
      switch (action) {
        case 'RotateIndirect':
          if (props.port === 'D' && props.build==='Vernie'&& props.valueMin && props.valueMax) {
            const isInputIndirectOK: boolean = checkInputValue(Number(inputValue), Number(props.moveHub.deviceInfo.ports.D.value), 'indirect', props.valueMin, props.valueMax)
            if (isInputIndirectOK)
              hub.motorAngle(props.port, Number(inputValue), props.dutyCycleIndirect, () => false);
          }
          else {
            hub.motorAngle(props.port, Number(inputValue), props.dutyCycleIndirect, () => false);
          }
          break;
        case 'RotateDirect':
          if (props.port === 'D' && props.build ==='Vernie' && props.valueMin && props.valueMax) {
            const isInputDirectOK = checkInputValue(Number(inputValue), Number(props.moveHub.deviceInfo.ports.D.value), 'direct', props.valueMin, props.valueMax)
            if (isInputDirectOK) {
              hub.motorAngle(props.port, Number(inputValue), props.dutyCycleDirect, () => false);
            }
          }
          else {
            hub.motorAngle(props.port, Number(inputValue), props.dutyCycleDirect, () => false);
          }
          break;
        case 'Drive':
          hub.drive(Number(inputValue));
          break;
        case 'Turn':
          hub.turn(Number(inputValue));
          break;
        case 'WakeUp':
          console.log('Wake up');
          break;
        case 'SitDown':
          console.log('Sit down');
          break;
        default:
          console.error('This action is unknown');
          break;
      }
    };
  };

  return (
    <div>
      <div className="move-form-main-container">
        <div className="move-input-field-text">
          <p style={{ margin: '8px 0' }}>
            {props.label} {props.unit}
          </p>
        </div>
        <div className="move-input-field-with-2buttons">
          <InputField
            type={props.type}
            value={inputValue}
            onChange={setInputValue}
          />
          <button
            className="move-validation-button"
            onClick={selectMove(props.actionButton1)}
          >
            {props.buttonText1}
          </button>
          <button
            className="move-validation-button"
            onClick={selectMove(props.actionButton2)}
          >
            {props.buttonText2}
          </button>
        </div>
      </div>
    </div>
  );
}
