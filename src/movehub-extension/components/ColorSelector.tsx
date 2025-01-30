import { useState } from 'react';
import { IHubControlProps } from '../moveHubPanelView';

const colors = [
  'off',
  'pink',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'red',
  'white'
];

export function ColorSelector(props: IHubControlProps) {
  const [selectedColor, setSelectedColor] = useState<string>('Select a color');
  const hub = props.hub;
  if (!hub || !hub.emitter || !hub.ledAsync) {
    console.error('Hub is not properly initialized:', hub);
    return <div>Error: Hub is not initialized</div>;
  }
  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Value has changed');
    try {
      if (selectedColor) {
        hub.ledAsync(event.target.value); // Directly set the LED color
        setSelectedColor(event.target.value); // Update selected color state
      }
    } catch (error) {
      console.error('Failed to change LED color:', error);
    }
  };

  return (
    <div className="color-selector-main-container">
      <div className="color-selector-text">
        <h4>Pick a color for the LED</h4>
      </div>
      <div className="color-dropdown-container">
        <select
          className="custom-select"
          id="color-select"
          value={selectedColor}
          onChange={handleColorChange}
        >
          <option value="">Select a color</option>{' '}
          {/* Optional default placeholder */}
          {colors.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
