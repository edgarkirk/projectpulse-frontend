import './KpiCard.css';

interface KpiCardProps {
  label: string;
  value: number;
}

export const KpiCard = ({ label, value }: KpiCardProps): JSX.Element => {
  return (
    <div className="pp-kpi">
      <div className="pp-kpi__label">
        {label}
        <span className="pp-kpi__value">{value}</span>
      </div>
    </div>
  );
};
