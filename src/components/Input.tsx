import type { ChangeEvent } from 'react';

export interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  placeholder?: string;
}

export const Input = ({ errorMessage, id, label, onChange, placeholder, value }: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-invalid={errorMessage ? 'true' : 'false'}
        aria-describedby={errorMessage ? errorId : undefined}
      />
      {errorMessage ? (
        <div id={errorId} role="alert">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};
