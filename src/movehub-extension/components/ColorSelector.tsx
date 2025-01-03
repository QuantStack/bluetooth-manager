import { useState } from 'react';
import { Button, Grid2 } from '@mui/material';
import { HubAsync } from '../moveHub/hub/hubAsync';

const colorOptionsDict: Record<string, string> = {
  '#cecece': 'off',
  '#ffc0cb': 'pink',
  '#800080': 'purple',
  '#0000ff': 'blue',
  '#00ffff': 'cyan',
  '#008000': 'green',
  '#ffff00': 'yellow',
  '#ed7f10': 'orange',
  '#f00020': 'red',
  '#ffffff': 'white'
};

export const colorValues = Object.keys(colorOptionsDict);

export interface IColorPickerProps {
  hub: HubAsync; // Declare the 'hub' property with its correct type
  colorValues: Array<string>;
}

export const ColorSelector = (props: IColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const hub = props.hub;

  if (!hub || !hub.emitter || !hub.ledAsync) {
    console.error('Hub is not properly initialized:', hub);
    return <div>Error: Hub is not initialized</div>;
  }

  return (
    <div className="color-pickers-container">
      <h4>Pick a color for the LED</h4>
      <div style={{ marginLeft: '0.5rem' }}>
        <Grid2 container spacing={2} justifyContent="center">
          {props.colorValues.map((color: string, index) => (
            <Grid2 key={index} component="div">
              <Button
                className={`button-${color}`}
                style={{
                  backgroundColor: color,
                  width: '4rem',
                  height: '1.5rem',
                  border:
                    selectedColor === color
                      ? '3px solid black'
                      : '1px solid gray'
                }}
                onClick={() => {
                  try {
                    const colorString = colorOptionsDict[color]; // Map color to its corresponding value
                    console.log(`You clicked on: ${colorString}`);
                    hub.ledAsync(colorString); // Directly set the LED color
                    setSelectedColor(color); // Update selected color state
                  } catch (error) {
                    console.error('Failed to change LED color:', error);
                  }
                }}
              ></Button>
            </Grid2>
          ))}
        </Grid2>
      </div>
    </div>
  );
};
