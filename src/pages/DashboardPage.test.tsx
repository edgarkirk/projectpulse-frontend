import { render, screen, waitFor, within } from '@testing-library/react';

import { DashboardPage } from './DashboardPage';
import { fetchDashboardSummary, fetchProjects } from '../api';
import { buildProject, buildSummary } from '../testSupport';

jest.mock('../api');

describe('DashboardPage', () => {
  it('should_requestDashboardData_onLoad_and_renderFiveKpiCards', async () => {
    const summary = buildSummary();
    const projects = [
      buildProject({
        id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        name: 'Project Alpha',
        ownerName: 'Alice',
        createdAt: '2026-07-03T10:00:00.000Z',
      }),
      buildProject({
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        name: 'Project Beta',
        ownerName: 'Bob',
        createdAt: '2026-07-03T09:00:00.000Z',
      }),
      buildProject({
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        name: 'Project Gamma',
        ownerName: 'Carol',
        createdAt: '2026-07-03T08:00:00.000Z',
      }),
      buildProject({
        id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        name: 'Project Delta',
        ownerName: 'Dan',
        createdAt: '2026-07-03T07:00:00.000Z',
      }),
      buildProject({
        id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        name: 'Project Epsilon',
        ownerName: 'Eve',
        createdAt: '2026-07-03T06:00:00.000Z',
      }),
      buildProject({
        id: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
        name: 'Project Zeta',
        ownerName: 'Zed',
        createdAt: '2026-07-03T05:00:00.000Z',
      }),
    ];

    jest.mocked(fetchDashboardSummary).mockResolvedValue(summary);
    jest.mocked(fetchProjects).mockResolvedValue(projects);

    render(<DashboardPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => expect(fetchDashboardSummary).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetchProjects).toHaveBeenCalledTimes(1));

    expect(screen.getByRole('heading', { name: /total projects/i })).toHaveTextContent('6');
    expect(screen.getByRole('heading', { name: /active/i })).toHaveTextContent('3');
    expect(screen.getByRole('heading', { name: /at risk/i })).toHaveTextContent('2');
    expect(screen.getByRole('heading', { name: /blocked/i })).toHaveTextContent('1');
    expect(screen.getByRole('heading', { name: /on hold/i })).toHaveTextContent('0');

    const recentProjectsTable = screen.getByRole('table', { name: /recent projects/i });
    expect(within(recentProjectsTable).getByText('Project Alpha')).toBeInTheDocument();
    expect(within(recentProjectsTable).getByText('Project Epsilon')).toBeInTheDocument();
    expect(within(recentProjectsTable).queryByText('Project Zeta')).not.toBeInTheDocument();
  });
});
