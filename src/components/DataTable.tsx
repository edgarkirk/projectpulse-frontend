import type { ReactNode } from 'react';
import './DataTable.css';

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
  return (
    <div className="pp-table-wrap">
      <h3 className="pp-table-title">{caption}</h3>
      <table aria-label={caption} className="pp-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
