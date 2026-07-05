import './KpiCard.css';

export interface KpiCardProps {
  title: string;
  value: number;
}

export function KpiCard({ title, value }: KpiCardProps): JSX.Element {
  return (
    <div className="pp-kpi">
      <div className="pp-kpi__label">{title}</div>
      <div className="pp-kpi__value">{value}</div>
    </div>
  );
}
