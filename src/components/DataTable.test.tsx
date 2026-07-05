import { render, screen, within } from '@testing-library/react';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  it('should render the table caption, headers, and rows', () => {
    render(
      <DataTable
        caption="Recent projects"
        columns={[
          { header: 'Name' },
          { header: 'Owner' },
          { header: 'Status' },
        ]}
        rows={[
          {
            key: '1',
            cells: ['Atlas Migration', 'Jane Doe', 'Active'],
          },
          {
            key: '2',
            cells: ['Apollo Launch', 'Sam Reed', 'Blocked'],
          },
        ]}
      />
    );

    const table = screen.getByRole('table', { name: /recent projects/i });
    expect(within(table).getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(within(table).getByText('Atlas Migration')).toBeInTheDocument();
    expect(within(table).getByText('Apollo Launch')).toBeInTheDocument();
  });

  it('should render an empty body when no rows are available', () => {
    render(
      <DataTable
        caption="Projects"
        columns={[
          { header: 'Name' },
          { header: 'Owner' },
          { header: 'Status' },
        ]}
        rows={[]}
      />
    );

    expect(screen.getByRole('table', { name: /projects/i })).toBeInTheDocument();
  });
});
