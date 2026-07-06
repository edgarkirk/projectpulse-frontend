import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsPage } from './ProjectsPage';
import * as api from '../api';

jest.mock('../api');
const mockApi = api as jest.Mocked<typeof api>;

describe('ProjectsPage', () => {
  const initialProjects = [
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      name: 'Website Redesign',
      ownerName: 'Sam Lee',
      status: 'At Risk',
      createdAt: '2026-07-05T11:00:00.000Z',
    },
  ];

  const createdProject = {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    name: 'Atlas Migration',
    ownerName: 'Jane Doe',
    status: 'Active',
    createdAt: '2026-07-05T12:00:00.000Z',
  };

  beforeEach(() => {
    mockApi.fetchProjects.mockReset();
    mockApi.createProject.mockReset();
  });

  it('should render a loading state before the projects list arrives', () => {
    mockApi.fetchProjects.mockResolvedValue(initialProjects);

    render(<ProjectsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render the full projects table when the projects load', async () => {
    mockApi.fetchProjects.mockResolvedValue(initialProjects);

    render(<ProjectsPage />);

    expect(await screen.findByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Sam Lee')).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('should display an error alert when the projects request fails', async () => {
    mockApi.fetchProjects.mockRejectedValue(new Error('Projects list unavailable'));

    render(<ProjectsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Projects list unavailable');
  });

  it('should append the created project to the top of the list and show a success message', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValue(initialProjects);
    mockApi.createProject.mockResolvedValue(createdProject);

    render(<ProjectsPage />);

    await screen.findByText('Website Redesign');

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/created/i);
    const firstDataRow = screen.getAllByRole('row')[1];
    expect(within(firstDataRow).getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
  });

  it('should display the exact API message when project creation fails', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValue(initialProjects);
    mockApi.createProject.mockRejectedValue(new Error('Project name already exists'));

    render(<ProjectsPage />);

    await screen.findByText('Website Redesign');

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Project name already exists');
  });
});
