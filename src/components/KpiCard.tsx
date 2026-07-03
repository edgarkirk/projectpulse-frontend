import React from 'react';

export interface KpiCardProps {
  label: string;
  value: number;
}

export function KpiCard({ label, value }: KpiCardProps): JSX.Element {
  return (
    <article aria-label={label}>
      <h3>{label}</h3>
      <p role="status">{value}</p>
    </article>
  );
}
