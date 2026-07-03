export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export const Select = ({ label }: SelectProps) => {
  return <div>{label}</div>;
};
