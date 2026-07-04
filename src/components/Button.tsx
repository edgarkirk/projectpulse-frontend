import React from 'react';

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
    >
      {children}
    </button>
  );
}
