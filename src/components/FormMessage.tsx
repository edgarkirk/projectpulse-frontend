import React from 'react';

export interface FormMessageProps {
  variant: 'success' | 'error';
  message: string;
}

export function FormMessage({ variant, message }: FormMessageProps): JSX.Element {
  return (
    <div
      role="alert"
      className={`pp-form-message pp-form-message--${variant}`}
      aria-live="assertive"
    >
      {message}
    </div>
  );
}
