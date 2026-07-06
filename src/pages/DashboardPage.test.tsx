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

  it('should show loading before dashboard data is displayed', () => {
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

  it('should display KPI cards and the first five recent projects after loading', async () => {
    mockApi.fetchDashboardSummary.mockResolvedValue({
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    });
    mockApi.fetchProjects.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Project One',
        ownerName: 'Owner One',
        status: 'Active',
        createdAt: '2026-07-06T11:00:00.000Z',
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        name: 'Project Two',
        ownerName: 'Owner Two',
        status: 'At Risk',
        createdAt: '2026-07-06T10:00:00.000Z',
      },
      {
        id: '33333333-3333-4333-8333-333333333333',
        name: 'Project Three',
        ownerName: 'Owner Three',
        status: 'Blocked',
        createdAt: '2026-07-06T09:00:00.000Z',
      },
      {
        id: '44444444-4444-4444-8444-444444444444',
        name: 'Project Four',
        ownerName: 'Owner Four',
        status: 'On Hold',
        createdAt: '2026-07-06T08:00:00.000Z',
      },
      {
        id: '55555555-5555-4555-8555-555555555555',
        name: 'Project Five',
        ownerName: 'Owner Five',
        status: 'Active',
        createdAt: '2026-07-06T07:00:00.000Z',
      },
      {
        id: '66666666-6666-4666-8666-666666666666',
        name: 'Project Six',
        ownerName: 'Owner Six',
        status: 'Blocked',
        createdAt: '2026-07-06T06:00:00.000Z',
      },
    ]);

    render(<DashboardPage />);

    expect(await screen.findByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Five')).toBeInTheDocument();
    expect(screen.queryByText('Project Six')).not.toBeInTheDocument();
  });

  it('should display an error alert when dashboard data fails to load', async () => {
    mockApi.fetchDashboardSummary.mockRejectedValue(new Error('Dashboard summary failed'));
    mockApi.fetchProjects.mockResolvedValue([]);

    render(<DashboardPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Dashboard summary failed');
  });
});
