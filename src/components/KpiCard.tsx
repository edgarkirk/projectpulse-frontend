import './KpiCard.css';

export interface KpiCardProps {
  label: string;
  value: number;
}

export const KpiCard = ({ label, value }: KpiCardProps) => {
  return (
    <section className="kpi-card" aria-label={label}>
      <h2>
        {label}: {value}
      </h2>
      <p>{value}</p>
    </section>
  );
};
