import type { ReactNode } from 'react';
import './Button.css';

export interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ children, disabled = false, onClick, type = 'button' }: ButtonProps): JSX.Element {
  return (
    <button className="pp-btn pp-btn--primary" disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
