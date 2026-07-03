import type { MouseEventHandler, ReactNode } from 'react';

import './Button.css';

export interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ children, disabled = false, onClick, type = 'button' }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className="button">
      {children}
    </button>
  );
};
