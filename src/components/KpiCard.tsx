import React from 'react';

export interface KpiCardProps {
  label: string;
  value: number;
}

export function KpiCard({ label, value }: KpiCardProps): JSX.Element {
  return (
    <article>
      <h3>{label}</h3>
      <p>{value}</p>
    </article>
  );
}
