import type { ReactNode } from 'react';

import './DataTable.css';

export interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
  emptyMessage?: string;
}

export const DataTable = ({ headers, rows, emptyMessage = 'No results found' }: DataTableProps) => {
  const hasRows = rows.length > 0;

  return (
    <div className='pp-table-wrap'>
      <table className='pp-table'>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className='pp-table__empty' colSpan={headers.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
