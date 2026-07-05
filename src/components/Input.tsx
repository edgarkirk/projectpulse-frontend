import { useId, type ChangeEventHandler } from 'react';

import './Input.css';

export interface InputProps {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
}

export const Input = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
  maxLength,
  required = false,
  type = 'text',
}: InputProps) => {
  const inputId = useId();

  return (
    <div className='pp-field'>
      <label className='pp-field__label' htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className='pp-input'
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
};
