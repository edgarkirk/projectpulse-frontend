import type { ReactNode } from 'react';

export interface DataTableColumn {
  header: string;
}

export interface DataTableRow {
  key: string;
  cells: ReadonlyArray<ReactNode>;
}

export interface DataTableProps {
  caption: string;
  columns: ReadonlyArray<DataTableColumn>;
  rows: ReadonlyArray<DataTableRow>;
}

export function DataTable({ caption, columns, rows }: DataTableProps): JSX.Element {
  void caption;
  void columns;
  void rows;
  throw new Error('TODO: implement DataTable');
}
