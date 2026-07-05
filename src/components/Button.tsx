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
    <button className='pp-btn pp-btn--primary' type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
