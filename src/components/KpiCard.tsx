import React from 'react';
import './KpiCard.css';

export interface KpiCardProps {
  label: string;
  value: number;
}

export function KpiCard({ label, value }: KpiCardProps): JSX.Element {
  return (
    <section className="pp-kpi-card" aria-label={label}>
      <span className="pp-kpi-card__label">{label}</span>
      <strong className="pp-kpi-card__value">{value}</strong>
    </section>
  );
}
