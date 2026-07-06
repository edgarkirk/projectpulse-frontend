import './Button.css';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, type = 'button', ...rest }: ButtonProps) => {
  const classes = className ? `pp-btn pp-btn--primary ${className}` : 'pp-btn pp-btn--primary';

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  );
};
