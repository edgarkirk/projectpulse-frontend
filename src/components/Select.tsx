import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: ReadonlyArray<SelectOption>;
  onChange: (value: string) => void;
}

export function Select(props: SelectProps): JSX.Element {
  const { id, label, value, options, onChange } = props;

  return (
    <div className="pp-field">
      <label className="pp-field__label" htmlFor={id}>
        {label}
      </label>
      <select
        className="pp-field__select"
        id={id}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
