//import { useState } from 'react';
import { IHubControlProps } from '../moveHubPanelView';
import Select from 'react-select';
const colorOptions = [
  { value: '#cecece', label: 'off' },
  { value: '#ffc0cb', label: 'pink' },
  { value: '#800080', label: 'purple' },
  { value: '#0000ff', label: 'blue' },
  { value: '#00ffff', label: 'cyan' },
  { value: '#008000', label: 'green' },
  { value: '#ffff00', label: 'yellow' },
  { value: '#ed7f10', label: 'orange' },
  { value: '#f00020', label: 'red' },
  { value: '#ffffff', label: 'white' }
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    height: '36px', // Reduce the height of the control box to 24px
    minHeight: '36px', // Ensure the control box has at least 24px height
    padding: '0 0', // Adjust horizontal padding to fit in the smaller control box
    lineHeight: '18px', // Vertically center the text inside the control
    borderRadius: '4px', // Optional: adjust border radius
    borderColor: 'black',
    width: '150px',
    margin: '0 0',
    positon: 'absolute'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    lineHeight: '24px', // Vertically center the placeholder text
    fontSize: '12px', // Font size of the placeholder
    color: '#888888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#333333', // Color for the selected text
    lineHeight: '24px', // Vertically center the selected text
    fontSize: '12px' // Font size of the selected text
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#cccccc' : 'transparent',
    color: state.isSelected ? '#000000' : '#333333',
    padding: '6px 10px', // Adjust padding for options
    cursor: 'pointer'
  })
};
export function ColorSelector(props: IHubControlProps) {
  /*const [selectedColor, setSelectedColor] = useState<string>('blue');*/
  const hub = props.hub;
  if (!hub || !hub.emitter || !hub.ledAsync) {
    console.error('Hub is not properly initialized:', hub);
    return <div>Error: Hub is not initialized</div>;
  }

  return (
    <div className="color-selector-main-container">
      <div className="color-selector-text">
        <h4>Pick a color for the LED</h4>
      </div>
      <div className="color-dropdown-container">
        <Select
          styles={customStyles}
          options={colorOptions}
          onChange={selectedOption => {
            try {
              if (selectedOption) {
                const colorString = selectedOption.label; // Map color to its corresponding value
                hub.ledAsync(colorString); // Directly set the LED color
                /*setSelectedColor(selectedOption.value); // Update selected color state*/
              }
            } catch (error) {
              console.error('Failed to change LED color:', error);
            }
          }}
        />
      </div>
    </div>
  );
}
