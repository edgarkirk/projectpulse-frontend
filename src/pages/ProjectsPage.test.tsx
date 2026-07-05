import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsPage } from './ProjectsPage';
import { createProject, getProjects } from '../api';
import type { ProjectResponse } from '../types';

jest.mock('../api', () => ({
  createProject: jest.fn(),
  getProjects: jest.fn(),
}));

const mockedCreateProject = createProject as jest.MockedFunction<typeof createProject>;
const mockedGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

describe('ProjectsPage', () => {
  beforeEach(() => {
    mockedCreateProject.mockReset();
    mockedGetProjects.mockReset();
  });

  it('should render the create form and load the existing projects table', async () => {
    const projects: ReadonlyArray<ProjectResponse> = [
      {
        id: '1',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-05T10:00:00.000Z',
      },
    ];

    mockedGetProjects.mockResolvedValueOnce(projects);

    render(<ProjectsPage />);

    expect(await screen.findByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();

    const table = screen.getByRole('table', { name: /projects/i });
    expect(within(table).getByText('Atlas Migration')).toBeInTheDocument();
  });

  it('should create a project and show a success message without reloading the page', async () => {
    const user = userEvent.setup();
    const existingProjects: ReadonlyArray<ProjectResponse> = [];
    const createdProject: ProjectResponse = {
      id: '2',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-05T11:00:00.000Z',
    };

    mockedGetProjects.mockResolvedValueOnce(existingProjects);
    mockedCreateProject.mockResolvedValueOnce(createdProject);

    render(<ProjectsPage />);

    await user.type(await screen.findByLabelText(/project name/i), ' Atlas Migration ');
    await user.type(screen.getByLabelText(/owner name/i), ' Jane Doe ');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(mockedCreateProject).toHaveBeenCalledWith({
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    });
    expect(await screen.findByRole('status')).toHaveTextContent(/project created/i);
    expect(screen.getByRole('table', { name: /projects/i })).toHaveTextContent('Atlas Migration');
  });

  it.each([
    'Name is required',
    'Project name already taken',
  ])('should display the api error message verbatim when createProject fails with %s', async (message) => {
    const user = userEvent.setup();

    mockedGetProjects.mockResolvedValueOnce([]);
    mockedCreateProject.mockRejectedValueOnce(new Error(message));

    render(<ProjectsPage />);

    await user.type(await screen.findByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(message);
  });
});
