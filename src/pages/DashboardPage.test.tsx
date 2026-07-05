import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DashboardSummary, ProjectResponse } from '../types';

function mockJsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('DashboardPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    window.location.hash = '#/dashboard';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the five KPI cards and the recent-projects table when data loads', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };
    const projects: ProjectResponse[] = [
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000006',
        name: 'Zeta',
        ownerName: 'Casey',
        status: 'On Hold',
        createdAt: '2026-07-05T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000005',
        name: 'Epsilon',
        ownerName: 'Riley',
        status: 'Blocked',
        createdAt: '2026-07-04T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000004',
        name: 'Delta',
        ownerName: 'Jordan',
        status: 'At Risk',
        createdAt: '2026-07-03T09:44:48.000Z',
      },
    ];

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockJsonResponse(summary, 200))
      .mockResolvedValueOnce(mockJsonResponse(projects, 200));

    const modulePath = './DashboardPage';
    const dashboardPageModule = await import(modulePath);
    const DashboardPage = dashboardPageModule.DashboardPage;

    render(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /total projects/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /at risk/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /blocked/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /on hold/i })).toBeInTheDocument();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('should render only the first five projects in the recent-projects table when more than five are returned', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };
    const projects: ProjectResponse[] = [
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000006',
        name: 'Zeta',
        ownerName: 'Casey',
        status: 'On Hold',
        createdAt: '2026-07-05T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000005',
        name: 'Epsilon',
        ownerName: 'Riley',
        status: 'Blocked',
        createdAt: '2026-07-04T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000004',
        name: 'Delta',
        ownerName: 'Jordan',
        status: 'At Risk',
        createdAt: '2026-07-03T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000003',
        name: 'Gamma',
        ownerName: 'Alex',
        status: 'Active',
        createdAt: '2026-07-02T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000002',
        name: 'Beta',
        ownerName: 'Sam',
        status: 'Active',
        createdAt: '2026-07-01T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000001',
        name: 'Alpha',
        ownerName: 'Morgan',
        status: 'Active',
        createdAt: '2026-06-30T09:44:48.000Z',
      },
    ];

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockJsonResponse(summary, 200))
      .mockResolvedValueOnce(mockJsonResponse(projects, 200));

    const modulePath = './DashboardPage';
    const dashboardPageModule = await import(modulePath);
    const DashboardPage = dashboardPageModule.DashboardPage;

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Zeta')).toBeInTheDocument();
      expect(screen.getByText('Epsilon')).toBeInTheDocument();
      expect(screen.getByText('Delta')).toBeInTheDocument();
      expect(screen.getByText('Gamma')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });

  it('should allow the user to refresh the dashboard view without leaving the page', async () => {
    const user = userEvent.setup();
    const summary: DashboardSummary = {
      totalProjects: 1,
      active: 1,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    };
    const projects: ProjectResponse[] = [];

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockJsonResponse(summary, 200))
      .mockResolvedValueOnce(mockJsonResponse(projects, 200));

    const modulePath = './DashboardPage';
    const dashboardPageModule = await import(modulePath);
    const DashboardPage = dashboardPageModule.DashboardPage;

    render(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /total projects/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(window.location.hash).toBe('#/dashboard');
  });
});
