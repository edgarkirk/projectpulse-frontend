import './DataTable.css';
import type { ReactNode } from 'react';

interface DataTableProps {
  title: string;
  children: ReactNode;
}

export const DataTable = ({ title, children }: DataTableProps) => (
  <section className="pp-table-wrap">
    <div className="pp-table-title">{title}</div>
    {children}
  </section>
);
