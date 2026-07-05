import type { ChangeEventHandler } from 'react';

export interface InputProps {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export function Input(_props: InputProps): null {
  return null;
}
