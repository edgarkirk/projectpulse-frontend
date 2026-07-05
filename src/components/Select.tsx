import { useId, type ChangeEventHandler } from 'react';

import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const Select = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = 'Select status...',
  required = true,
}: SelectProps) => {
  const selectId = useId();

  return (
    <div className='pp-field'>
      <label className='pp-field__label' htmlFor={selectId}>
        {label}
      </label>
      <select
        id={selectId}
        className='pp-select'
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        <option value='' disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
