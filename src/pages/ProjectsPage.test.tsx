import React from 'react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CreateProjectRequest, ProjectResponse } from '../api';
import { ProjectsPage } from '../pages/ProjectsPage';
import { createProject, fetchProjects } from '../api';

jest.mock('../api');

const mockCreateProject = jest.mocked(createProject);
const mockFetchProjects = jest.mocked(fetchProjects);

const existingProjects: ProjectResponse[] = [
  { id: '1', name: 'Atlas Migration', ownerName: 'Jane Doe', status: 'Active', createdAt: '2026-07-03T12:00:00.000Z' },
];

const createdProject: ProjectResponse = {
  id: '2',
  name: 'Beacon Refresh',
  ownerName: 'Alex Smith',
  status: 'Blocked',
  createdAt: '2026-07-04T08:00:00.000Z',
};

beforeEach(() => {
  mockCreateProject.mockReset();
  mockFetchProjects.mockReset();
});

describe('ProjectsPage', () => {
  test('should submit the create form and show the success message', async () => {
    const user = userEvent.setup();

    mockFetchProjects.mockResolvedValueOnce(existingProjects);
    mockCreateProject.mockResolvedValueOnce(createdProject);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/project name/i), 'Beacon Refresh');
    await user.type(screen.getByLabelText(/owner name/i), 'Alex Smith');
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Blocked');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalledWith({
        name: 'Beacon Refresh',
        ownerName: 'Alex Smith',
        status: 'Blocked',
      } satisfies CreateProjectRequest);
    });

    expect(screen.getByText('Beacon Refresh')).toBeInTheDocument();
    expect(screen.getByText('Project created successfully')).toBeInTheDocument();
  });

  test('should display API validation messages as-is', async () => {
    const user = userEvent.setup();

    mockFetchProjects.mockResolvedValueOnce(existingProjects);
    mockCreateProject.mockRejectedValueOnce(new Error('Name is required'));

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required');
  });

  test('should show the full project list table on load', async () => {
    mockFetchProjects.mockResolvedValueOnce(existingProjects);

    render(<ProjectsPage />);

    await screen.findByText('Atlas Migration');

    expect(screen.getByRole('table', { name: /projects list/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Owner' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
  });
});
