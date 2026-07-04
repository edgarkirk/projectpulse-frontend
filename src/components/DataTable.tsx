import React from 'react';

export interface DataTableProps {
  title: string;
  headers: ReadonlyArray<string>;
  children?: React.ReactNode;
}

export function DataTable({ title, headers, children }: DataTableProps): JSX.Element {
  return (
    <section className="pp-data-table">
      <header className="pp-data-table__header">
        <h2>{title}</h2>
      </header>
      <table className="pp-table" aria-label={title}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </section>
  );
}
