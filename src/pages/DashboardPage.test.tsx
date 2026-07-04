import React from 'react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { render, screen, waitFor, within } from '@testing-library/react';
import type { DashboardSummary, ProjectResponse } from '../api';
import { DashboardPage } from '../pages/DashboardPage';
import { fetchDashboardSummary, fetchProjects } from '../api';

jest.mock('../api');

const mockFetchDashboardSummary = jest.mocked(fetchDashboardSummary);
const mockFetchProjects = jest.mocked(fetchProjects);

const summary: DashboardSummary = {
  totalProjects: 6,
  active: 3,
  atRisk: 2,
  blocked: 1,
  onHold: 0,
};

const projects: ProjectResponse[] = [
  { id: '1', name: 'Alpha', ownerName: 'Jane', status: 'Active', createdAt: '2026-07-03T12:00:00.000Z' },
  { id: '2', name: 'Beta', ownerName: 'Sam', status: 'At Risk', createdAt: '2026-07-03T11:00:00.000Z' },
  { id: '3', name: 'Gamma', ownerName: 'Lee', status: 'Blocked', createdAt: '2026-07-03T10:00:00.000Z' },
  { id: '4', name: 'Delta', ownerName: 'Rae', status: 'On Hold', createdAt: '2026-07-03T09:00:00.000Z' },
  { id: '5', name: 'Epsilon', ownerName: 'Mia', status: 'Active', createdAt: '2026-07-03T08:00:00.000Z' },
  { id: '6', name: 'Zeta', ownerName: 'Noah', status: 'Active', createdAt: '2026-07-03T07:00:00.000Z' },
];

beforeEach(() => {
  mockFetchDashboardSummary.mockReset();
  mockFetchProjects.mockReset();
});

describe('DashboardPage', () => {
  test('should render five KPI cards from the summary response', async () => {
    mockFetchDashboardSummary.mockResolvedValueOnce(summary);
    mockFetchProjects.mockResolvedValueOnce(projects);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockFetchDashboardSummary).toHaveBeenCalledTimes(1);
      expect(mockFetchProjects).toHaveBeenCalledTimes(1);
    });

    await screen.findByText('Alpha');

    expect(within(screen.getByLabelText('Total Projects')).getByText('6')).toBeInTheDocument();
    expect(within(screen.getByLabelText('Active')).getByText('3')).toBeInTheDocument();
    expect(within(screen.getByLabelText('At Risk')).getByText('2')).toBeInTheDocument();
    expect(within(screen.getByLabelText('Blocked')).getByText('1')).toBeInTheDocument();
    expect(within(screen.getByLabelText('On Hold')).getByText('0')).toBeInTheDocument();
  });

  test('should render the five most recent projects', async () => {
    mockFetchDashboardSummary.mockResolvedValueOnce(summary);
    mockFetchProjects.mockResolvedValueOnce(projects);

    render(<DashboardPage />);

    await screen.findByText('Alpha');

    expect(screen.getByRole('table', { name: /recent projects/i })).toBeInTheDocument();
    expect(screen.getByText('Epsilon')).toBeInTheDocument();
    expect(screen.queryByText('Zeta')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });

  test('should display an error when the summary request fails', async () => {
    mockFetchDashboardSummary.mockRejectedValueOnce(new Error('Summary unavailable'));
    mockFetchProjects.mockResolvedValueOnce(projects);

    render(<DashboardPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Summary unavailable');
  });
});
