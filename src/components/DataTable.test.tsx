import { render, screen } from '@testing-library/react';

import { DataTable } from './DataTable';
import type { ProjectResponse } from '../types';

describe('DataTable', () => {
  const rows: ProjectResponse[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-03T12:00:00.000Z',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'North Star',
      ownerName: 'Sam Lee',
      status: 'Blocked',
      createdAt: '2026-07-02T12:00:00.000Z',
    },
  ];

  it('should_renderTheRows_whenTableHasData', () => {
    render(
      <DataTable
        caption='Projects'
        columns={['Name', 'Owner', 'Status']}
        rows={rows}
        emptyMessage='No projects yet.'
      />
    );

    expect(screen.getByRole('table', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should_renderTheEmptyState_whenTableHasNoRows', () => {
    render(
      <DataTable
        caption='Projects'
        columns={['Name', 'Owner', 'Status']}
        rows={[]}
        emptyMessage='No projects yet.'
      />
    );

    expect(screen.getByText('No projects yet.')).toBeInTheDocument();
  });
});
