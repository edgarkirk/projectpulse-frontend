import type { ChangeEventHandler } from 'react';

export interface InputProps {
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password';
  value: string;
  maxLength?: number;
}

export function Input({ label, name, onChange, placeholder, required, type, value, maxLength }: InputProps): JSX.Element {
  void label;
  void name;
  void onChange;
  void placeholder;
  void required;
  void type;
  void value;
  void maxLength;
  throw new Error('TODO: implement Input');
}
