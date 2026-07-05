import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Projects } from './Projects';
import * as api from './api';
import { ProjectResponse } from './types';

jest.mock('./api');

const mockApi = jest.mocked(api);

describe('Projects', () => {
  beforeEach(() => {
    mockApi.fetchProjects.mockReset();
    mockApi.createProject.mockReset();
  });

  it('should load projects on mount and render the create form with the full list', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-05T12:00:00.000Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Beacon Launch',
        ownerName: 'John Smith',
        status: 'At Risk',
        createdAt: '2026-07-04T12:00:00.000Z',
      },
    ];

    mockApi.fetchProjects.mockResolvedValueOnce(projects);

    render(<Projects />);

    expect(mockApi.fetchProjects).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Beacon Launch')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Owner Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should prepend the new project and show a success message after creation', async () => {
    const user = userEvent.setup();
    const initialProjects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Beacon Launch',
        ownerName: 'John Smith',
        status: 'At Risk',
        createdAt: '2026-07-04T12:00:00.000Z',
      },
    ];

    const createdProject: ProjectResponse = {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-05T12:00:00.000Z',
    };

    mockApi.fetchProjects.mockResolvedValueOnce(initialProjects);
    mockApi.createProject.mockResolvedValueOnce(createdProject);

    render(<Projects />);

    await user.type(screen.getByLabelText('Project Name'), 'Atlas Migration');
    await user.type(screen.getByLabelText('Owner Name'), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText('Status'), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(mockApi.createProject).toHaveBeenCalledWith({
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    });
    expect(await screen.findByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Project created successfully');
    expect(screen.getAllByText('Atlas Migration')[0]).toBeInTheDocument();
  });

  it('should display the API error message when create submission fails', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValueOnce([]);
    mockApi.createProject.mockRejectedValueOnce(new Error('Project name Atlas Migration is already taken'));

    render(<Projects />);

    await user.type(screen.getByLabelText('Project Name'), 'Atlas Migration');
    await user.type(screen.getByLabelText('Owner Name'), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText('Status'), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Project name Atlas Migration is already taken'
    );
  });
});
