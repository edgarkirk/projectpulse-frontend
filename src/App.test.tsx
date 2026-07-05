import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from './App';
import * as api from './api';
import type { DashboardSummary, ProjectResponse } from './types/project';

jest.mock('./api');

const mockApi = jest.mocked(api);

const dashboardSummary: DashboardSummary = {
  totalProjects: 2,
  active: 1,
  atRisk: 0,
  blocked: 1,
  onHold: 0,
};

const dashboardProjects: ProjectResponse[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Atlas Migration',
    ownerName: 'Jane Doe',
    status: 'Active',
    createdAt: '2026-07-03T09:20:00.000Z',
  },
];

const projectsProjects: ProjectResponse[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'North Star',
    ownerName: 'Sam Lee',
    status: 'Blocked',
    createdAt: '2026-07-03T08:20:00.000Z',
  },
];

describe('App', () => {
  beforeEach(() => {
    mockApi.fetchDashboardSummary.mockReset();
    mockApi.fetchProjects.mockReset();
    window.location.hash = '';
  });

  it('should render the dashboard page for the dashboard hash route', async () => {
    window.location.hash = '#/dashboard';
    mockApi.fetchDashboardSummary.mockResolvedValueOnce(dashboardSummary);
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);

    render(<App />);

    expect(await screen.findByRole('heading', { name: /^dashboard$/i, level: 1 })).toBeInTheDocument();
  });

  it('should render the projects page for the projects hash route', async () => {
    window.location.hash = '#/projects';
    mockApi.fetchProjects.mockResolvedValueOnce(projectsProjects);

    render(<App />);

    expect(await screen.findByRole('heading', { name: /^projects$/i, level: 1 })).toBeInTheDocument();
  });

  it('should update the hash and switch to the projects page when the sidebar link is clicked', async () => {
    const user = userEvent.setup();

    window.location.hash = '#/dashboard';
    mockApi.fetchDashboardSummary.mockResolvedValueOnce(dashboardSummary);
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);
    mockApi.fetchProjects.mockResolvedValueOnce(projectsProjects);

    render(<App />);

    expect(await screen.findByRole('heading', { name: /^dashboard$/i, level: 1 })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(await screen.findByRole('heading', { name: /^projects$/i, level: 1 })).toBeInTheDocument();
  });
});
