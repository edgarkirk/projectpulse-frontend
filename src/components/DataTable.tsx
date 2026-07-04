import type { ReactNode } from 'react';
import './DataTable.css';

interface DataTableProps {
  title: string;
  ariaLabel: string;
  headers: string[];
  children: ReactNode;
}

export const DataTable = ({ title, ariaLabel, headers, children }: DataTableProps): JSX.Element => {
  return (
    <div className="pp-table-wrap">
      <h3 className="pp-table-title">{title}</h3>
      <table className="pp-table" aria-label={ariaLabel}>
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
    </div>
  );
};
