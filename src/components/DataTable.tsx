import type { ReactNode } from 'react';

export interface DataTableColumn {
  key: string;
  header: string;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: Array<Record<string, ReactNode>>;
  emptyMessage: string;
}

export const DataTable = ({ emptyMessage }: DataTableProps) => {
  return <div>{emptyMessage}</div>;
};
