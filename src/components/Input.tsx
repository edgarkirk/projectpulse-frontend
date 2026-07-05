import type { ChangeEventHandler } from 'react';
import './Input.css';

export interface InputProps {
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password';
  value: string;
  maxLength?: number;
}

export function Input({ label, name, onChange, placeholder, required, type = 'text', value, maxLength }: InputProps): JSX.Element {
  return (
    <div className="pp-field">
      <label className="pp-field__label" htmlFor={name}>
        {label}
      </label>
      <input
        className="pp-input"
        id={name}
        maxLength={maxLength}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}
