import type { ChangeEventHandler } from 'react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: ReadonlyArray<SelectOption>;
  placeholder: string;
  required?: boolean;
  value: string;
}

export function Select({ label, name, onChange, options, placeholder, required, value }: SelectProps): JSX.Element {
  return (
    <div className="pp-field">
      <label className="pp-field__label" htmlFor={name}>
        {label}
      </label>
      <select className="pp-select" id={name} name={name} onChange={onChange} required={required} value={value}>
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
