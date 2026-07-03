import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectsPage } from './ProjectsPage';
import { createProject, getProjects } from '../api';

jest.mock('../api');

import type { CreateProjectRequest, ProjectResponse } from '../types';

describe('ProjectsPage', () => {
  const mockedCreateProject = jest.mocked(createProject);
  const mockedGetProjects = jest.mocked(getProjects);

  const initialProjects: ProjectResponse[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-03T12:00:00.000Z',
    },
  ];

  const createdProject: ProjectResponse = {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'North Star',
    ownerName: 'Sam Lee',
    status: 'Blocked',
    createdAt: '2026-07-04T12:00:00.000Z',
  };

  beforeEach(() => {
    mockedGetProjects.mockResolvedValue(initialProjects);
    mockedCreateProject.mockResolvedValue(createdProject);
  });

  afterEach(() => {
    mockedGetProjects.mockReset();
    mockedCreateProject.mockReset();
  });

  it('should_renderTheCreateFormAndProjectTable_whenThePageLoads', async () => {
    render(<ProjectsPage />);

    expect(await screen.findByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(await screen.findByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /projects/i })).toBeInTheDocument();
  });

  it('should_createTheProjectAndRefreshTheList_whenTheFormIsSubmitted', async () => {
    const user = userEvent.setup();

    mockedGetProjects.mockResolvedValueOnce(initialProjects).mockResolvedValueOnce([createdProject, ...initialProjects]);

    render(<ProjectsPage />);

    await user.type(await screen.findByLabelText(/project name/i), 'North Star');
    await user.type(screen.getByLabelText(/owner name/i), 'Sam Lee');
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Blocked');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(mockedCreateProject).toHaveBeenCalledWith({
        name: 'North Star',
        ownerName: 'Sam Lee',
        status: 'Blocked',
      } satisfies CreateProjectRequest);
    });

    expect(await screen.findByRole('status')).toHaveTextContent("Project 'North Star' created successfully");
    expect(screen.getByText('North Star')).toBeInTheDocument();
  });

  it('should_showTheApiErrorMessage_andKeepTheInputs_whenTheCreateRequestFails', async () => {
    const user = userEvent.setup();

    mockedCreateProject.mockRejectedValueOnce(new Error('Project name is already taken'));

    render(<ProjectsPage />);

    await user.type(await screen.findByLabelText(/project name/i), 'North Star');
    await user.type(screen.getByLabelText(/owner name/i), 'Sam Lee');
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Blocked');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Project name is already taken');
    expect(screen.getByLabelText(/project name/i)).toHaveValue('North Star');
  });
});
