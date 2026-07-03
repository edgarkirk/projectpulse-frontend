import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, type = 'button', ...props }: ButtonProps): JSX.Element {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
}
