import './FormMessage.css';

interface FormMessageProps {
  kind: 'success' | 'error';
  message: string;
}

export const FormMessage = ({ kind, message }: FormMessageProps): JSX.Element => {
  return (
    <div
      className={`pp-msg pp-msg--${kind}`}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={kind === 'error' ? 'assertive' : 'polite'}
    >
      {message}
    </div>
  );
};
