
import React, { ReactElement, useState } from 'react';

interface InputFieldProps {

  type: string; // Default to "text" if not specified
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function InputField(
props : InputFieldProps

): ReactElement{
  const [inputValue, setInputValue] = useState<string>(props.value);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (props.onChange) props.onChange(newValue);
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
      </label>
      <input
        type={props.type}
        value={inputValue}
        placeholder={props.placeholder}
        onChange={handleInputChange}
        style={{
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
 
    </div>
  );
}
