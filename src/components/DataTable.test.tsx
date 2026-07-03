import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';

import { DataTable, type DataTableColumn } from './DataTable';
import { StatusTag } from './StatusTag';

describe('DataTable', () => {
  type DataTableRow = {
    name: string;
    ownerName: string;
    status: ReactNode;
  };

  const columns: Array<DataTableColumn<DataTableRow>> = [
    { key: 'name', header: 'Name' },
    { key: 'ownerName', header: 'Owner' },
    { key: 'status', header: 'Status' },
  ];

  const rows: DataTableRow[] = [
    { name: 'Atlas Migration', ownerName: 'Jane Doe', status: <StatusTag status="Active" /> },
    { name: 'Northwind Refresh', ownerName: 'Ada Lovelace', status: <StatusTag status="At Risk" /> },
  ];

  it('should_renderTableHeadersAndRows_when_rowsExist', () => {
    render(
      <DataTable columns={columns} rows={rows} emptyMessage="No projects yet." />
    );

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(within(table).getByText('Atlas Migration')).toBeInTheDocument();
  });

  it('should_renderEmptyState_when_rowsAreMissing', () => {
    render(<DataTable columns={columns} rows={[]} emptyMessage="No projects yet." />);

    expect(screen.getByText('No projects yet.')).toBeInTheDocument();
  });
});
