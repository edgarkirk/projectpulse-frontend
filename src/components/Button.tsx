import React from 'react';
import './Button.css';

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    onClick,
    disabled = false,
    type = 'button',
    'aria-label': ariaLabel,
  } = props;

  return (
    <button
      className="pp-button"
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {children}
    </button>
  );
}
