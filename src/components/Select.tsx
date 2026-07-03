import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: ReadonlyArray<SelectOption>;
  onChange: (value: string) => void;
}

export function Select({ id, label, value, options }: SelectProps): JSX.Element {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} disabled>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
