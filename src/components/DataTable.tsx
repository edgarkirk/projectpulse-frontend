import React from 'react';

import type { ProjectResponse } from '../types';

export interface DataTableProps {
  caption: string;
  columns: ReadonlyArray<string>;
  rows: ReadonlyArray<ProjectResponse>;
  emptyMessage: string;
}

export function DataTable({ caption, columns, rows, emptyMessage }: DataTableProps): JSX.Element {
  if (rows.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.ownerName}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
