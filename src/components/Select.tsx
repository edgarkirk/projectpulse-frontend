import './Select.css';
import type { ReactNode, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  children: ReactNode;
}

export const Select = ({ id, label, children, ...rest }: SelectProps) => (
  <div className="pp-field">
    <label className="pp-field__label" htmlFor={id}>
      {label}
    </label>
    <select className="pp-select" id={id} {...rest}>
      {children}
    </select>
  </div>
);
