import { IMoveHubPanelProps } from '../moveHubPanelView';
import { useState } from 'react';

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



export function ColorSelector({ device }: IMoveHubPanelProps) {
  const [selectedColor, setSelectedColor] = useState<string>('Select a color');

  const hub = device.hub;
  if (!hub || !hub.emitter || !hub.ledAsync) {
    console.error('Hub is not properly initialized:', hub);
    return <div>Error: Hub is not initialized</div>;
  }
  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      if (selectedColor) {
        hub.ledAsync(event.target.value);
        setSelectedColor(event.target.value);
        device.deviceInfo = { ...device.deviceInfo, ledColor: event.target.value }
        
      }
    } catch (error) {
      console.error('Failed to change LED color:', error);
    }
  };

  return (
    <div>
      <h4 style={{ color: 'var(--jp-accept-color-normal)', margin: "0", padding: "0" }}>Other control</h4>
      <div className="color-selector-main-container">
        <div className="color-selector-text">
          <p style={{ margin: '8px 0' }}>Pick a color for the LED</p>
        </div>
        <div className="color-dropdown-container">
          <select
            className="custom-select"
            id="color-select"
            value={selectedColor}
            onChange={handleColorChange}
          >
            <option value="">Select a color</option>{' '}
            {colors.map(color => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
