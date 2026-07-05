import { render, screen } from '@testing-library/react';
import { ProjectList } from './ProjectList';
import { ProjectResponse } from './types';

describe('ProjectList', () => {
  it('should render project names and status badges', () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-01T12:00:00.000Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Beacon Launch',
        ownerName: 'John Smith',
        status: 'Blocked',
        createdAt: '2026-07-02T12:00:00.000Z',
      },
    ];

    render(<ProjectList projects={projects} />);

    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Beacon Launch')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('should render an empty state when no projects are provided', () => {
    render(<ProjectList projects={[]} />);

    expect(screen.getByText('No projects found')).toBeInTheDocument();
  });
});
