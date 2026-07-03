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
  error?: string | null;
}

export function Select({ id, label, value, options, onChange, error }: SelectProps): JSX.Element {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
