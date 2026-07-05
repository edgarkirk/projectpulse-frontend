import type { ChangeEventHandler } from 'react';

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
  void label;
  void name;
  void onChange;
  void options;
  void placeholder;
  void required;
  void value;
  throw new Error('TODO: implement Select');
}
