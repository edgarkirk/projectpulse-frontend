import './FormMessage.css';

interface FormMessageProps {
  message: string;
  tone: 'success' | 'error';
}

export const FormMessage = ({ message, tone }: FormMessageProps) => {
  const role = tone === 'error' ? 'alert' : 'status';

  return (
    <p className={`pp-msg pp-msg--${tone}`} role={role} aria-live={tone === 'error' ? 'assertive' : 'polite'}>
      {message}
    </p>
  );
};
