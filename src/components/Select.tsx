import type { ChangeEventHandler } from 'react';

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
}

export function Select(_props: SelectProps): null {
  return null;
}
