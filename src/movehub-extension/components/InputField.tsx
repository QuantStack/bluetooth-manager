import React, { ReactElement, useState } from 'react';

interface InputFieldProps {
  type: string; // Default to "text" if not specified
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function InputField(props: InputFieldProps): ReactElement {
  const [inputValue, setInputValue] = useState<string>(props.value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (props.onChange) props.onChange(newValue);
  };

  return (
    <div>
      <input
        className="move-input-field"
        type={props.type}
        value={inputValue}
        placeholder={props.placeholder}
        onChange={handleInputChange}
      />
    </div>
  );
}
