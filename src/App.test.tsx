import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { getDashboardSummary, getProjects } from './api';
import type { DashboardSummary, ProjectResponse } from './types';

jest.mock('./api', () => ({
  getDashboardSummary: jest.fn(),
  getProjects: jest.fn(),
  createProject: jest.fn(),
  getProjectById: jest.fn(),
}));

const mockedGetDashboardSummary = getDashboardSummary as jest.MockedFunction<typeof getDashboardSummary>;
const mockedGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

describe('App', () => {
  beforeEach(() => {
    mockedGetDashboardSummary.mockReset();
    mockedGetProjects.mockReset();
    window.location.hash = '#/dashboard';
  });

  it('should always show the project name in the top bar on the dashboard route', async () => {
    const summary: DashboardSummary = {
      totalProjects: 1,
      active: 1,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    };

    const projects: ReadonlyArray<ProjectResponse> = [
      {
        id: '1',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-05T10:00:00.000Z',
      },
    ];

    mockedGetDashboardSummary.mockResolvedValueOnce(summary);
    mockedGetProjects.mockResolvedValueOnce(projects);

    render(<App />);

    expect(await screen.findByText('ProjectPulse')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
  });

  it('should navigate to the projects page when the sidebar link is clicked', async () => {
    const user = userEvent.setup();
    const summary: DashboardSummary = {
      totalProjects: 1,
      active: 1,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    };

    const projects: ReadonlyArray<ProjectResponse> = [
      {
        id: '1',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-05T10:00:00.000Z',
      },
    ];

    mockedGetDashboardSummary.mockResolvedValueOnce(summary);
    mockedGetProjects.mockResolvedValueOnce(projects);

    render(<App />);

    await user.click(await screen.findByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
  });
});
