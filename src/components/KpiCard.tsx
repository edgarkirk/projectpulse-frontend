export interface KpiCardProps {
  title: string;
  value: number;
}

export function KpiCard({ title, value }: KpiCardProps): JSX.Element {
  void title;
  void value;
  throw new Error('TODO: implement KpiCard');
}
