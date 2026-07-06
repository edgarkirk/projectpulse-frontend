import { render, screen } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';
import * as api from '../api';

jest.mock('../api');
const mockApi = api as jest.Mocked<typeof api>;

describe('DashboardPage', () => {
  beforeEach(() => {
    mockApi.fetchDashboardSummary.mockReset();
    mockApi.fetchProjects.mockReset();
  });

  it('should render a loading state before dashboard data arrives', () => {
    mockApi.fetchDashboardSummary.mockResolvedValue({
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    });
    mockApi.fetchProjects.mockResolvedValue([]);

    render(<DashboardPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render the KPI cards and the five most recent projects when data loads', async () => {
    mockApi.fetchDashboardSummary.mockResolvedValue({
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    });
    mockApi.fetchProjects.mockResolvedValue([
      {
        id: '77777777-7777-7777-7777-777777777777',
        name: 'Project One',
        ownerName: 'Owner One',
        status: 'Active',
        createdAt: '2026-07-05T12:00:00.000Z',
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        name: 'Project Two',
        ownerName: 'Owner Two',
        status: 'At Risk',
        createdAt: '2026-07-05T11:00:00.000Z',
      },
      {
        id: '99999999-9999-9999-9999-999999999999',
        name: 'Project Three',
        ownerName: 'Owner Three',
        status: 'Blocked',
        createdAt: '2026-07-05T10:00:00.000Z',
      },
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        name: 'Project Four',
        ownerName: 'Owner Four',
        status: 'On Hold',
        createdAt: '2026-07-05T09:00:00.000Z',
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        name: 'Project Five',
        ownerName: 'Owner Five',
        status: 'Active',
        createdAt: '2026-07-05T08:00:00.000Z',
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        name: 'Project Six',
        ownerName: 'Owner Six',
        status: 'Blocked',
        createdAt: '2026-07-05T07:00:00.000Z',
      },
    ]);

    render(<DashboardPage />);

    expect(await screen.findByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('On Hold')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Five')).toBeInTheDocument();
    expect(screen.queryByText('Project Six')).not.toBeInTheDocument();
  });

  it('should display an error alert when dashboard data cannot be fetched', async () => {
    mockApi.fetchDashboardSummary.mockRejectedValue(new Error('Dashboard summary unavailable'));
    mockApi.fetchProjects.mockResolvedValue([]);

    render(<DashboardPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Dashboard summary unavailable');
  });

  it('should show an empty state when there are no recent projects', async () => {
    mockApi.fetchDashboardSummary.mockResolvedValue({
      totalProjects: 0,
      active: 0,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    });
    mockApi.fetchProjects.mockResolvedValue([]);

    render(<DashboardPage />);

    expect(await screen.findByText(/no projects found/i)).toBeInTheDocument();
  });
});
