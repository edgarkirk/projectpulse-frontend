import './Input.css';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const Input = ({ id, label, ...rest }: InputProps) => (
  <div className="pp-field">
    <label className="pp-field__label" htmlFor={id}>
      {label}
    </label>
    <input className="pp-input" id={id} {...rest} />
  </div>
);
