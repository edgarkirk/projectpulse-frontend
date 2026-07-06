import './KpiCard.css';

export interface KpiCardProps {
  label: string;
  value: number;
}

export const KpiCard = ({ label, value }: KpiCardProps) => (
  <article className="pp-kpi">
    <div className="pp-kpi__label">{label}</div>
    <div className="pp-kpi__value">{value}</div>
  </article>
);
