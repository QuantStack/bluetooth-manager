import { useState } from 'react';
import { Button } from '@mui/material';
//import { HubAsync } from './moveHub/hub/hubAsync';

export interface IColorPickerProps {
  //hub: HubAsync; // Declare the 'hub' property with its correct type
  colorOptions: Array<string>
}

function ColorPicker(props: IColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');



  return (
    <div>
      <h3>Pick a Color</h3>

      {props.colorOptions.map(color => (
        <Button
          style={{
            backgroundColor: color,
            width: '40px',
            height: '10px',
            border: selectedColor === color ? '2px solid black' : 'none'
          }}
          onClick={() => {
            if (selectedColor === '#ffc0cb') {
              /*props.hub.emitter.on('color', () => {
                props.hub.ledAsync('pink');
              });*/
            }
            setSelectedColor(color);
          }}
        />
      ))}

      <div>
        <h4>Selected Color: {selectedColor}</h4>
      </div>
    </div>
  );
}

export default ColorPicker;
