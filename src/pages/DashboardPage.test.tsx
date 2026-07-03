import { render, screen, waitFor } from '@testing-library/react';

import { DashboardPage } from './DashboardPage';
import { getDashboardSummary, getProjects } from '../api';

jest.mock('../api');

import type { DashboardSummary, ProjectResponse } from '../types';

describe('DashboardPage', () => {
  const mockedGetDashboardSummary = jest.mocked(getDashboardSummary);
  const mockedGetProjects = jest.mocked(getProjects);

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
      createdAt: '2026-07-03T12:00:00.000Z',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'North Star',
      ownerName: 'Sam Lee',
      status: 'Blocked',
      createdAt: '2026-07-02T12:00:00.000Z',
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Harbor',
      ownerName: 'Mia Chen',
      status: 'At Risk',
      createdAt: '2026-07-01T12:00:00.000Z',
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Summit',
      ownerName: 'Avery Patel',
      status: 'Active',
      createdAt: '2026-06-30T12:00:00.000Z',
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Orbit',
      ownerName: 'Jordan Kim',
      status: 'On Hold',
      createdAt: '2026-06-29T12:00:00.000Z',
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Beacon',
      ownerName: 'Riley Fox',
      status: 'Active',
      createdAt: '2026-06-28T12:00:00.000Z',
    },
    {
      id: '77777777-7777-7777-7777-777777777777',
      name: 'Pioneer',
      ownerName: 'Taylor Wu',
      status: 'Blocked',
      createdAt: '2026-06-27T12:00:00.000Z',
    },
  ];

  beforeEach(() => {
    mockedGetDashboardSummary.mockResolvedValue(summary);
    mockedGetProjects.mockResolvedValue(projects);
  });

  afterEach(() => {
    mockedGetDashboardSummary.mockReset();
    mockedGetProjects.mockReset();
  });

  it('should_callTheDashboardApis_whenThePageMounts', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockedGetDashboardSummary).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockedGetProjects).toHaveBeenCalledTimes(1);
    });
  });

  it('should_renderFiveKpisAndOnlyFiveRecentProjects_whenDataLoads', async () => {
    render(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /total projects/i })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.queryByText('Pioneer')).not.toBeInTheDocument();
  });
});
