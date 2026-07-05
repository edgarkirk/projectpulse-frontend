import { render, screen, within } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';
import { getDashboardSummary, getProjects } from '../api';
import type { DashboardSummary, ProjectResponse } from '../types';

jest.mock('../api', () => ({
  getDashboardSummary: jest.fn(),
  getProjects: jest.fn(),
}));

const mockedGetDashboardSummary = getDashboardSummary as jest.MockedFunction<typeof getDashboardSummary>;
const mockedGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

describe('DashboardPage', () => {
  beforeEach(() => {
    mockedGetDashboardSummary.mockReset();
    mockedGetProjects.mockReset();
  });

  it('should render the five KPI cards and the five most recent projects', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    const projects: ReadonlyArray<ProjectResponse> = [
      {
        id: '1',
        name: 'Project One',
        ownerName: 'Owner One',
        status: 'Active',
        createdAt: '2026-07-05T10:00:00.000Z',
      },
      {
        id: '2',
        name: 'Project Two',
        ownerName: 'Owner Two',
        status: 'At Risk',
        createdAt: '2026-07-05T09:00:00.000Z',
      },
      {
        id: '3',
        name: 'Project Three',
        ownerName: 'Owner Three',
        status: 'Blocked',
        createdAt: '2026-07-05T08:00:00.000Z',
      },
      {
        id: '4',
        name: 'Project Four',
        ownerName: 'Owner Four',
        status: 'On Hold',
        createdAt: '2026-07-05T07:00:00.000Z',
      },
      {
        id: '5',
        name: 'Project Five',
        ownerName: 'Owner Five',
        status: 'Active',
        createdAt: '2026-07-05T06:00:00.000Z',
      },
      {
        id: '6',
        name: 'Project Six',
        ownerName: 'Owner Six',
        status: 'At Risk',
        createdAt: '2026-07-05T05:00:00.000Z',
      },
    ];

    mockedGetDashboardSummary.mockResolvedValueOnce(summary);
    mockedGetProjects.mockResolvedValueOnce(projects);

    render(<DashboardPage />);

    expect(await screen.findByText(/total projects/i)).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    const table = screen.getByRole('table', { name: /recent projects/i });
    expect(within(table).getByText('Project One')).toBeInTheDocument();
    expect(within(table).getByText('Project Five')).toBeInTheDocument();
    expect(within(table).queryByText('Project Six')).not.toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });
});
