export interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  placeholder?: string;
}

export const Input = ({ label }: InputProps) => {
  return <div>{label}</div>;
};
