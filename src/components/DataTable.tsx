import type { ReactNode } from 'react';

import './DataTable.css';

export interface DataTableColumn<T extends Record<string, ReactNode>> {
  key: keyof T;
  header: string;
}

export interface DataTableProps<T extends Record<string, ReactNode>> {
  ariaLabel?: string;
  columns: Array<DataTableColumn<T>>;
  emptyMessage: string;
  getRowKey?: (row: T) => string;
  rows: T[];
}

export const DataTable = <T extends Record<string, ReactNode>>({
  ariaLabel,
  columns,
  emptyMessage,
  getRowKey,
  rows,
}: DataTableProps<T>) => {
  if (rows.length === 0) {
    return <div className="data-table-empty">{emptyMessage}</div>;
  }

  return (
    <table aria-label={ariaLabel} className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={getRowKey ? getRowKey(row) : `${String(row[columns[0].key])}-${rowIndex}`}>
            {columns.map((column) => (
              <td key={String(column.key)}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
