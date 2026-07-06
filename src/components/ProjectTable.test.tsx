import { render, screen } from '@testing-library/react';
import type { ProjectResponse } from '../types';
import { ProjectTable } from './ProjectTable';

describe('ProjectTable', () => {
  it('should render project rows with name, owner, and status values', () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-06T11:00:00.000Z',
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        name: 'Nova Launch',
        ownerName: 'John Smith',
        status: 'Blocked',
        createdAt: '2026-07-06T10:00:00.000Z',
      },
    ];

    render(<ProjectTable projects={projects} />);

    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Nova Launch')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('should render an empty state when there are no projects', () => {
    render(<ProjectTable projects={[]} />);

    expect(screen.getByText('No projects found')).toBeInTheDocument();
  });
});
