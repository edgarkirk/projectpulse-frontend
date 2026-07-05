import { render, screen, within } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import * as api from './api';
import { DashboardSummary, ProjectResponse } from './types';

jest.mock('./api');

const mockApi = jest.mocked(api);

describe('Dashboard', () => {
  beforeEach(() => {
    mockApi.fetchDashboardSummary.mockReset();
    mockApi.fetchProjects.mockReset();
  });

  it('should request dashboard summary and projects on mount and render five KPI cards', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-05T12:00:00.000Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Beacon Launch',
        ownerName: 'John Smith',
        status: 'At Risk',
        createdAt: '2026-07-04T12:00:00.000Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Cinder Rollout',
        ownerName: 'Ada Lovelace',
        status: 'Blocked',
        createdAt: '2026-07-03T12:00:00.000Z',
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Delta Release',
        ownerName: 'Grace Hopper',
        status: 'On Hold',
        createdAt: '2026-07-02T12:00:00.000Z',
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Echo Migration',
        ownerName: 'Linus Torvalds',
        status: 'Active',
        createdAt: '2026-07-01T12:00:00.000Z',
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'Fjord Stabilization',
        ownerName: 'Margaret Hamilton',
        status: 'Blocked',
        createdAt: '2026-06-30T12:00:00.000Z',
      },
    ];

    mockApi.fetchDashboardSummary.mockResolvedValueOnce(summary);
    mockApi.fetchProjects.mockResolvedValueOnce(projects);

    render(<Dashboard />);

    expect(mockApi.fetchDashboardSummary).toHaveBeenCalledTimes(1);
    expect(mockApi.fetchProjects).toHaveBeenCalledTimes(1);

    const kpis = await screen.findByRole('region', { name: /dashboard kpis/i });
    expect(within(kpis).getByRole('article', { name: 'Total Projects' })).toHaveTextContent('6');
    expect(within(kpis).getByRole('article', { name: 'Active' })).toHaveTextContent('3');
    expect(within(kpis).getByRole('article', { name: 'At Risk' })).toHaveTextContent('2');
    expect(within(kpis).getByRole('article', { name: 'Blocked' })).toHaveTextContent('1');
    expect(within(kpis).getByRole('article', { name: 'On Hold' })).toHaveTextContent('0');

    expect(await screen.findByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Beacon Launch')).toBeInTheDocument();
    expect(screen.getByText('Cinder Rollout')).toBeInTheDocument();
    expect(screen.getByText('Delta Release')).toBeInTheDocument();
    expect(screen.getByText('Echo Migration')).toBeInTheDocument();
    expect(screen.queryByText('Fjord Stabilization')).not.toBeInTheDocument();
  });

  it('should show only the five most recent projects in newest-first order', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-05T12:00:00.000Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Beacon Launch',
        ownerName: 'John Smith',
        status: 'At Risk',
        createdAt: '2026-07-04T12:00:00.000Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Cinder Rollout',
        ownerName: 'Ada Lovelace',
        status: 'Blocked',
        createdAt: '2026-07-03T12:00:00.000Z',
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Delta Release',
        ownerName: 'Grace Hopper',
        status: 'On Hold',
        createdAt: '2026-07-02T12:00:00.000Z',
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Echo Migration',
        ownerName: 'Linus Torvalds',
        status: 'Active',
        createdAt: '2026-07-01T12:00:00.000Z',
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'Fjord Stabilization',
        ownerName: 'Margaret Hamilton',
        status: 'Blocked',
        createdAt: '2026-06-30T12:00:00.000Z',
      },
    ];

    mockApi.fetchDashboardSummary.mockResolvedValueOnce({
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    });
    mockApi.fetchProjects.mockResolvedValueOnce(projects);

    render(<Dashboard />);

    expect(await screen.findByText('Atlas Migration')).toBeInTheDocument();
    const recentProjects = screen.getByRole('region', { name: /recent projects/i });
    expect(within(recentProjects).queryByText('Fjord Stabilization')).not.toBeInTheDocument();
    expect(within(recentProjects).getByText('Echo Migration')).toBeInTheDocument();
  });
});
