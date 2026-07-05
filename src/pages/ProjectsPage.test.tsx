import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ProjectResponse } from '../types';

function mockJsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('ProjectsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    window.location.hash = '#/projects';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the create form and prepend the new project when submission succeeds', async () => {
    const user = userEvent.setup();
    const initialProjects: ProjectResponse[] = [
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000002',
        name: 'Beta',
        ownerName: 'Sam',
        status: 'At Risk',
        createdAt: '2026-07-04T09:44:48.000Z',
      },
    ];
    const createdProject: ProjectResponse = {
      id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000003',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-05T09:44:48.000Z',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockJsonResponse(initialProjects, 200))
      .mockResolvedValueOnce(mockJsonResponse(createdProject, 201));

    const modulePath = './ProjectsPage';
    const projectsPageModule = await import(modulePath);
    const ProjectsPage = projectsPageModule.ProjectsPage;

    render(<ProjectsPage />);

    expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/project created/i);
      expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Atlas Migration');
    expect(screen.getAllByRole('row')[2]).toHaveTextContent('Beta');
  });

  it('should display the validation error message verbatim when the server returns 400', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockJsonResponse([], 200))
      .mockResolvedValueOnce(mockJsonResponse({ message: 'name is required' }, 400));

    const modulePath = './ProjectsPage';
    const projectsPageModule = await import(modulePath);
    const ProjectsPage = projectsPageModule.ProjectsPage;

    render(<ProjectsPage />);

    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('name is required');
  });

  it('should display the duplicate-name error message verbatim when the server returns 409', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockJsonResponse([], 200))
      .mockResolvedValueOnce(mockJsonResponse({ message: 'Project name is already taken' }, 409));

    const modulePath = './ProjectsPage';
    const projectsPageModule = await import(modulePath);
    const ProjectsPage = projectsPageModule.ProjectsPage;

    render(<ProjectsPage />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Project name is already taken');
  });
});
