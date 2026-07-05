import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import * as api from './api';
import type { DashboardSummary, ProjectResponse } from './types/project';

jest.mock('./api');

const mockApi = jest.mocked(api);

const dashboardSummary: DashboardSummary = {
  totalProjects: 6,
  active: 3,
  atRisk: 2,
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
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'North Star',
    ownerName: 'Sam Lee',
    status: 'Blocked',
    createdAt: '2026-07-03T08:20:00.000Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Beacon',
    ownerName: 'Priya Patel',
    status: 'At Risk',
    createdAt: '2026-07-03T07:20:00.000Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Harbor',
    ownerName: 'Noah Kim',
    status: 'On Hold',
    createdAt: '2026-07-03T06:20:00.000Z',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Summit',
    ownerName: 'Ava Jones',
    status: 'Active',
    createdAt: '2026-07-03T05:20:00.000Z',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Extra Project',
    ownerName: 'Mia Chen',
    status: 'Blocked',
    createdAt: '2026-07-03T04:20:00.000Z',
  },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    mockApi.fetchDashboardSummary.mockReset();
    mockApi.fetchProjects.mockReset();
  });

  it('should display a loading state before dashboard data arrives', () => {
    mockApi.fetchDashboardSummary.mockResolvedValueOnce(dashboardSummary);
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);

    render(<DashboardPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display the KPI cards and recent projects after loading', async () => {
    mockApi.fetchDashboardSummary.mockResolvedValueOnce(dashboardSummary);
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);

    render(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /^dashboard$/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Active', { selector: '.pp-kpi__label' })).toBeInTheDocument();
    expect(screen.getByText('At Risk', { selector: '.pp-kpi__label' })).toBeInTheDocument();
    expect(screen.getByText('Blocked', { selector: '.pp-kpi__label' })).toBeInTheDocument();
    expect(screen.getByText('On Hold', { selector: '.pp-kpi__label' })).toBeInTheDocument();

    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('North Star')).toBeInTheDocument();
    expect(screen.getByText('Beacon')).toBeInTheDocument();
    expect(screen.getByText('Harbor')).toBeInTheDocument();
    expect(screen.getByText('Summit')).toBeInTheDocument();
    expect(screen.queryByText('Extra Project')).not.toBeInTheDocument();
  });

  it('should display an alert when dashboard data cannot be loaded', async () => {
    mockApi.fetchDashboardSummary.mockRejectedValueOnce(new Error('Dashboard is unavailable'));
    mockApi.fetchProjects.mockResolvedValueOnce([]);

    render(<DashboardPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Dashboard is unavailable');
  });

  it('should display an empty state when there are no recent projects', async () => {
    mockApi.fetchDashboardSummary.mockResolvedValueOnce({
      totalProjects: 0,
      active: 0,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    });
    mockApi.fetchProjects.mockResolvedValueOnce([]);

    render(<DashboardPage />);

    expect(await screen.findByText(/no recent projects found/i)).toBeInTheDocument();
  });
});

describe('ProjectsPage', () => {
  beforeEach(() => {
    mockApi.fetchProjects.mockReset();
    mockApi.createProject.mockReset();
  });

  it('should display a loading state before project data arrives', () => {
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);

    render(<ProjectsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display the full project list after loading', async () => {
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);

    render(<ProjectsPage />);

    expect(await screen.findByRole('heading', { name: /^projects$/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('North Star')).toBeInTheDocument();
    expect(screen.getByText('Beacon')).toBeInTheDocument();
    expect(screen.getByText('Harbor')).toBeInTheDocument();
    expect(screen.getByText('Summit')).toBeInTheDocument();
    expect(screen.getByText('Extra Project')).toBeInTheDocument();
  });

  it('should display an alert when project data cannot be loaded', async () => {
    mockApi.fetchProjects.mockRejectedValueOnce(new Error('Projects list is unavailable'));

    render(<ProjectsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Projects list is unavailable');
  });

  it('should display an empty state when the project list is empty', async () => {
    mockApi.fetchProjects.mockResolvedValueOnce([]);

    render(<ProjectsPage />);

    expect(await screen.findByText(/no projects found/i)).toBeInTheDocument();
  });

  it('should keep the create button disabled until the required fields are filled', async () => {
    const user = userEvent.setup();
    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);

    render(<ProjectsPage />);

    await screen.findByText('Atlas Migration');

    const createButton = screen.getByRole('button', { name: /create project/i });

    expect(createButton).toBeDisabled();

    await user.type(screen.getByLabelText(/project name/i), 'New Project');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/^status$/i), 'Active');

    expect(createButton).toBeEnabled();
  });

  it('should add a new project to the table, clear the form, and show a success message after submit', async () => {
    const user = userEvent.setup();
    const createdProject: ProjectResponse = {
      id: '77777777-7777-7777-7777-777777777777',
      name: 'Apollo Launch',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-04T12:00:00.000Z',
    };

    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);
    mockApi.createProject.mockResolvedValueOnce(createdProject);

    render(<ProjectsPage />);

    await screen.findByText('Atlas Migration');

    await user.type(screen.getByLabelText(/project name/i), 'Apollo Launch');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/^status$/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByText('Apollo Launch')).toBeInTheDocument();
    expect(await screen.findByRole('status', { name: /project "apollo launch" created successfully\./i })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toHaveValue('');
    expect(screen.getByLabelText(/owner name/i)).toHaveValue('');
    expect(screen.getByLabelText(/^status$/i)).toHaveValue('');
  });

  it('should display the API validation message when create project returns HTTP 400', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);
    mockApi.createProject.mockRejectedValueOnce(new Error('Project name is required'));

    render(<ProjectsPage />);

    await screen.findByText('Atlas Migration');

    await user.type(screen.getByLabelText(/project name/i), 'New Project');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/^status$/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Project name is required');
  });

  it('should display the API validation message when create project returns HTTP 409', async () => {
    const user = userEvent.setup();

    mockApi.fetchProjects.mockResolvedValueOnce(dashboardProjects);
    mockApi.createProject.mockRejectedValueOnce(new Error('Project name is already taken'));

    render(<ProjectsPage />);

    await screen.findByText('Atlas Migration');

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/^status$/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Project name is already taken');
  });
});
