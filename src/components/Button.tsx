import type { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ children, disabled, onClick, type }: ButtonProps): JSX.Element {
  void children;
  void disabled;
  void onClick;
  void type;
  throw new Error('TODO: implement Button');
}
