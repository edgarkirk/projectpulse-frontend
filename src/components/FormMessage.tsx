export interface FormMessageProps {
  message: string | null;
  variant: 'error' | 'success';
}

export function FormMessage({ message, variant }: FormMessageProps): JSX.Element | null {
  void message;
  void variant;
  throw new Error('TODO: implement FormMessage');
}
