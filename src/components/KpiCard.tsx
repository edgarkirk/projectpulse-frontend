export interface KpiCardProps {
  label: string;
  value: number;
}

export const KpiCard = ({ label, value }: KpiCardProps) => {
  return (
    <section>
      <h2>{label}</h2>
      <p>{value}</p>
    </section>
  );
};
