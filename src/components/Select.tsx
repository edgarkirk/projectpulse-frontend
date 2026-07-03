import type { ChangeEvent } from 'react';

import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export const Select = ({ ariaLabel, id, label, onChange, options, value }: SelectProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div className="select-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={handleChange} aria-label={ariaLabel}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
