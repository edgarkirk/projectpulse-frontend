import React from 'react';
import './FormMessage.css';

export interface FormMessageProps {
  variant: 'success' | 'error';
  message: string;
}

export function FormMessage({ variant, message }: FormMessageProps): JSX.Element {
  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`pp-form-message pp-form-message--${variant}`}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {message}
    </div>
  );
}
