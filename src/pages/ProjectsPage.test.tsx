import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectsPage } from './ProjectsPage';
import * as api from '../api';

jest.mock('../api');

const mockApi = api as jest.Mocked<typeof api>;

describe('ProjectsPage', () => {
  beforeEach(() => {
    mockApi.fetchProjects.mockReset();
    mockApi.createProject.mockReset();
  });

  it('should show loading and then the project table after the list loads', async () => {
    mockApi.fetchProjects.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-06T11:00:00.000Z',
      },
    ]);

    render(<ProjectsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('should prepend the created project and show a success message after submission succeeds', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Existing Project',
        ownerName: 'Existing Owner',
        status: 'Blocked',
        createdAt: '2026-07-06T11:00:00.000Z',
      },
    ]);
    mockApi.createProject.mockResolvedValue({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-06T12:00:00.000Z',
    });

    render(<ProjectsPage />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(mockApi.createProject).toHaveBeenCalledWith({
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    });
    expect(await screen.findByRole('status')).toHaveTextContent('Project created successfully');
    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
  });

  it('should display the API error message when create project returns a validation failure', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValue([]);
    mockApi.createProject.mockRejectedValue(new Error('Name is required'));

    render(<ProjectsPage />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2);
    });

    screen.getAllByRole('alert').forEach((alert) => {
      expect(alert).toHaveTextContent('Name is required');
    });
  });

  it('should display an error alert when the project list fails to load', async () => {
    mockApi.fetchProjects.mockRejectedValue(new Error('Project list failed'));

    render(<ProjectsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Project list failed');
  });
});
