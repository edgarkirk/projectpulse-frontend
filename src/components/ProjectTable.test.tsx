import { render, screen } from '@testing-library/react';
import { ProjectTable } from './ProjectTable';
import type { ProjectResponse } from '../types';

describe('ProjectTable', () => {
  const projects: ProjectResponse[] = [
    {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-05T12:00:00.000Z',
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Website Redesign',
      ownerName: 'Sam Lee',
      status: 'At Risk',
      createdAt: '2026-07-05T11:00:00.000Z',
    },
  ];

  it('should render the project rows and table headings when data exists', () => {
    render(<ProjectTable projects={projects} emptyMessage="No projects found" />);

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
  });

  it('should render the empty message when there are no projects', () => {
    render(<ProjectTable projects={[]} emptyMessage="No projects found" />);

    expect(screen.getByText('No projects found')).toBeInTheDocument();
  });
});
