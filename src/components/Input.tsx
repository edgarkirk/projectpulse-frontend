import React from 'react';

export interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
}

export function Input({ id, label, value, placeholder, error }: InputProps): JSX.Element {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} placeholder={placeholder} readOnly />
      {error ? <p>{error}</p> : null}
    </div>
  );
}
