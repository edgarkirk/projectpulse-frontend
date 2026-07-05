import './FormMessage.css';

export interface FormMessageProps {
  message: string | null;
  variant: 'error' | 'success';
}

export function FormMessage({ message, variant }: FormMessageProps): JSX.Element | null {
  if (message === null) {
    return null;
  }

  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`pp-msg pp-msg--${variant}`} role={role}>
      {message}
    </div>
  );
}
