import './KpiCard.css';

export interface KpiCardProps {
  label: string;
  count: number;
}

export const KpiCard = ({ label, count }: KpiCardProps) => {
  return (
    <article className="pp-kpi" aria-label={label}>
      <p className="pp-kpi__label">{label}</p>
      <p className="pp-kpi__value">{count}</p>
    </article>
  );
};
