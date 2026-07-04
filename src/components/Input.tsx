import React from 'react';

export interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

export function Input(props: InputProps): JSX.Element {
  const { id, label, value, onChange, placeholder, name, required = false } = props;

  return (
    <div className="pp-field">
      <label className="pp-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="pp-field__input"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </div>
  );
}
