import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { createProject, fetchDashboardSummary, fetchProjects } from './api';
import type { DashboardSummary, ProjectResponse } from './types';

jest.mock('./api', () => ({
  createProject: jest.fn(),
  fetchDashboardSummary: jest.fn(),
  fetchProjects: jest.fn(),
  fetchProjectById: jest.fn(),
}));

const mockedCreateProject = jest.mocked(createProject);
const mockedFetchDashboardSummary = jest.mocked(fetchDashboardSummary);
const mockedFetchProjects = jest.mocked(fetchProjects);

const renderAtRoute = (hash: string): void => {
  window.location.hash = hash;
  render(<App />);
};

const makeProject = (
  id: string,
  name: string,
  ownerName: string,
  status: ProjectResponse['status'],
  createdAt: string
): ProjectResponse => ({
  id,
  name,
  ownerName,
  status,
  createdAt,
});

describe('App shell and pages', () => {
  beforeEach(() => {
    window.location.hash = '#/dashboard';
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('should_render_the_projectpulse_top_bar_and_sidebar_navigation_when_the_app_mounts', () => {
    renderAtRoute('#/dashboard');

    expect(screen.getByRole('heading', { name: /projectpulse/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('should_mark_dashboard_as_active_when_the_dashboard_route_is_visible', () => {
    renderAtRoute('#/dashboard');

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('should_mark_projects_as_active_when_the_projects_route_is_visible', () => {
    renderAtRoute('#/projects');

    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('should_navigate_to_projects_without_a_full_page_reload_when_the_sidebar_link_is_clicked', async () => {
    const user = userEvent.setup();
    renderAtRoute('#/dashboard');

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
  });

  it('should_fetch_dashboard_summary_and_projects_on_mount_when_the_dashboard_route_is_visible', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };
    const projects: ProjectResponse[] = [
      makeProject(
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Apollo',
        'Nia',
        'Active',
        '2026-07-04T21:00:00.000Z'
      ),
      makeProject(
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Beacon',
        'Omar',
        'At Risk',
        '2026-07-04T20:30:00.000Z'
      ),
      makeProject(
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Comet',
        'Priya',
        'Blocked',
        '2026-07-04T20:00:00.000Z'
      ),
      makeProject(
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'Delta',
        'Ravi',
        'On Hold',
        '2026-07-04T19:30:00.000Z'
      ),
      makeProject(
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'Echo',
        'Sara',
        'Active',
        '2026-07-04T19:00:00.000Z'
      ),
      makeProject(
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        'Foxtrot',
        'Tara',
        'At Risk',
        '2026-07-04T18:30:00.000Z'
      ),
    ];

    mockedFetchDashboardSummary.mockResolvedValueOnce(summary);
    mockedFetchProjects.mockResolvedValueOnce(projects);

    renderAtRoute('#/dashboard');

    await waitFor(() => {
      expect(mockedFetchDashboardSummary).toHaveBeenCalledTimes(1);
      expect(mockedFetchProjects).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(/total projects/i)).toHaveTextContent('6');
    expect(screen.getByText(/active/i)).toHaveTextContent('3');
    expect(screen.getByText(/at risk/i)).toHaveTextContent('2');
    expect(screen.getByText(/blocked/i)).toHaveTextContent('1');
    expect(screen.getByText(/on hold/i)).toHaveTextContent('0');
  });

  it('should_render_only_the_first_five_recent_projects_in_backend_order_on_the_dashboard', async () => {
    mockedFetchDashboardSummary.mockResolvedValueOnce({
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    });
    mockedFetchProjects.mockResolvedValueOnce([
      makeProject('11111111-1111-1111-1111-111111111111', 'Zeta', 'Zoe', 'Active', '2026-07-04T21:00:00.000Z'),
      makeProject('22222222-2222-2222-2222-222222222222', 'Yarrow', 'Yuri', 'At Risk', '2026-07-04T20:00:00.000Z'),
      makeProject('33333333-3333-3333-3333-333333333333', 'Xenon', 'Xavier', 'Blocked', '2026-07-04T19:00:00.000Z'),
      makeProject('44444444-4444-4444-4444-444444444444', 'Walnut', 'Wendy', 'On Hold', '2026-07-04T18:00:00.000Z'),
      makeProject('55555555-5555-5555-5555-555555555555', 'Vector', 'Vik', 'Active', '2026-07-04T17:00:00.000Z'),
      makeProject('66666666-6666-6666-6666-666666666666', 'Umbra', 'Uma', 'At Risk', '2026-07-04T16:00:00.000Z'),
    ]);

    renderAtRoute('#/dashboard');

    await waitFor(() => {
      expect(mockedFetchProjects).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('table', { name: /recent projects/i })).toHaveTextContent('Zeta');
    expect(screen.getByRole('table', { name: /recent projects/i })).toHaveTextContent('Vector');
    expect(screen.getByRole('table', { name: /recent projects/i })).not.toHaveTextContent('Umbra');
  });

  it('should_render_the_full_projects_table_with_name_owner_and_status_columns_when_the_projects_route_is_visible', async () => {
    mockedFetchProjects.mockResolvedValueOnce([
      makeProject('77777777-7777-7777-7777-777777777777', 'Atlas Migration', 'Jane Doe', 'Active', '2026-07-04T21:00:00.000Z'),
      makeProject('88888888-8888-8888-8888-888888888888', 'Beacon Refresh', 'Ravi Patel', 'At Risk', '2026-07-04T20:00:00.000Z'),
      makeProject('99999999-9999-9999-9999-999999999999', 'Comet Rollout', 'Nia Stone', 'Blocked', '2026-07-04T19:00:00.000Z'),
    ]);

    renderAtRoute('#/projects');

    await waitFor(() => {
      expect(mockedFetchProjects).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /projects/i })).toHaveTextContent('Atlas Migration');
    expect(screen.getByRole('table', { name: /projects/i })).toHaveTextContent('Beacon Refresh');
    expect(screen.getByRole('table', { name: /projects/i })).toHaveTextContent('Comet Rollout');
  });

  it('should_show_the_create_form_and_success_message_when_a_project_is_created_successfully', async () => {
    const user = userEvent.setup();
    const createdProject: ProjectResponse = makeProject(
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      'Atlas Migration',
      'Jane Doe',
      'Active',
      '2026-07-04T21:00:00.000Z'
    );

    mockedFetchProjects.mockResolvedValueOnce([]);
    mockedCreateProject.mockResolvedValueOnce(createdProject);

    renderAtRoute('#/projects');

    const nameInput = await screen.findByLabelText(/project name/i);
    const ownerInput = screen.getByLabelText(/owner name/i);
    const statusSelect = screen.getByLabelText(/status/i);
    const submitButton = screen.getByRole('button', { name: /create project/i });

    await user.type(nameInput, 'Atlas Migration');
    await user.type(ownerInput, 'Jane Doe');
    await user.selectOptions(statusSelect, 'Active');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedCreateProject).toHaveBeenCalledWith({
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      });
    });

    expect(screen.getByRole('status')).toHaveTextContent('Project Atlas Migration created');
    expect(screen.getByRole('table', { name: /projects/i })).toHaveTextContent('Atlas Migration');
  });

  it('should_keep_the_dashboard_summary_in_sync_after_creating_a_project_from_the_projects_page', async () => {
    const user = userEvent.setup();
    const initialSummary: DashboardSummary = {
      totalProjects: 1,
      active: 1,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    };
    const initialProjects: ProjectResponse[] = [
      makeProject(
        '11111111-1111-1111-1111-111111111111',
        'Atlas Migration',
        'Jane Doe',
        'Active',
        '2026-07-04T21:00:00.000Z'
      ),
    ];
    const createdProject = makeProject(
      '22222222-2222-2222-2222-222222222222',
      'Beacon Refresh',
      'Ravi Patel',
      'At Risk',
      '2026-07-04T22:00:00.000Z'
    );
    const pendingSummary = new Promise<DashboardSummary>(() => undefined);
    const pendingProjects = new Promise<ProjectResponse[]>(() => undefined);

    mockedFetchDashboardSummary.mockResolvedValueOnce(initialSummary);
    mockedFetchProjects.mockResolvedValueOnce(initialProjects);
    mockedFetchProjects.mockResolvedValueOnce(initialProjects);
    mockedCreateProject.mockResolvedValueOnce(createdProject);
    mockedFetchDashboardSummary.mockImplementationOnce(() => pendingSummary);
    mockedFetchProjects.mockImplementationOnce(() => pendingProjects);

    renderAtRoute('#/dashboard');

    await waitFor(() => {
      expect(mockedFetchDashboardSummary).toHaveBeenCalledTimes(1);
      expect(mockedFetchProjects).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByRole('table', { name: /recent projects/i })).toHaveTextContent(
        'Atlas Migration'
      );
    });

    await user.click(screen.getByRole('link', { name: /projects/i }));

    await waitFor(() => {
      expect(screen.getByRole('table', { name: /projects/i })).toHaveTextContent('Atlas Migration');
    });

    await user.type(await screen.findByLabelText(/project name/i), 'Beacon Refresh');
    await user.type(screen.getByLabelText(/owner name/i), 'Ravi Patel');
    await user.selectOptions(screen.getByRole('combobox', { name: /^status$/i }), 'At Risk');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(mockedCreateProject).toHaveBeenCalledWith({
        name: 'Beacon Refresh',
        ownerName: 'Ravi Patel',
        status: 'At Risk',
      });
    });

    await user.click(screen.getByRole('link', { name: /dashboard/i }));

    expect(screen.getByText(/total projects/i)).toHaveTextContent('2');
    expect(screen.getByRole('table', { name: /recent projects/i })).toHaveTextContent('Beacon Refresh');
  });


  it('should_display_the_api_validation_message_verbatim_when_create_submission_returns_400', async () => {
    const user = userEvent.setup();

    mockedFetchProjects.mockResolvedValueOnce([]);
    mockedCreateProject.mockRejectedValueOnce(new Error('name is required'));

    renderAtRoute('#/projects');

    await user.click(await screen.findByRole('button', { name: /create project/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('name is required');
  });

  it('should_display_the_api_conflict_message_verbatim_when_create_submission_returns_409', async () => {
    const user = userEvent.setup();

    mockedFetchProjects.mockResolvedValueOnce([]);
    mockedCreateProject.mockRejectedValueOnce(
      new Error('Project name Atlas Migration is already taken')
    );

    renderAtRoute('#/projects');

    await user.click(await screen.findByRole('button', { name: /create project/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Project name Atlas Migration is already taken'
    );
  });
});
