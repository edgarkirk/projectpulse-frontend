import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import type {
  CreateProjectRequest,
  DashboardSummary,
  ProjectResponse,
} from './types';

const createJsonResponse = <T,>(body: T, ok: boolean, status: number): Response => {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
};

describe('api module', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should_post_project_with_expected_request_and_return_project_response_when_createProject_succeeds', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };
    const responseBody: ProjectResponse = {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-04T21:00:00.000Z',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(responseBody, true, 201)
    );

    const result = await createProject(request);

    expect(global.fetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    expect(result).toEqual(responseBody);
  });

  it('should_throw_the_duplicate_name_message_when_createProject_returns_409', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse({ message: 'Project name Atlas Migration is already taken' }, false, 409)
    );

    await expect(createProject(request)).rejects.toThrow(
      'Project name Atlas Migration is already taken'
    );
  });

  it('should_return_projects_from_the_list_endpoint_when_fetchProjects_succeeds', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Zephyr Launch',
        ownerName: 'Ravi Patel',
        status: 'At Risk',
        createdAt: '2026-07-04T20:00:00.000Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-04T19:00:00.000Z',
      },
    ];

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(projects, true, 200)
    );

    const result = await fetchProjects();

    expect(global.fetch).toHaveBeenCalledWith('/api/projects');
    expect(result).toEqual(projects);
  });

  it('should_return_a_project_by_id_when_fetchProjectById_succeeds', async () => {
    const project: ProjectResponse = {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-04T21:00:00.000Z',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(project, true, 200)
    );

    const result = await fetchProjectById(project.id);

    expect(global.fetch).toHaveBeenCalledWith(`/api/projects/${project.id}`);
    expect(result).toEqual(project);
  });

  it('should_throw_a_not_found_message_when_fetchProjectById_returns_404', async () => {
    const projectId = '55555555-5555-5555-5555-555555555555';

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse({ message: 'Project not found' }, false, 404)
    );

    await expect(fetchProjectById(projectId)).rejects.toThrow('Project not found');
  });

  it('should_return_dashboard_summary_when_fetchDashboardSummary_succeeds', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(summary, true, 200)
    );

    const result = await fetchDashboardSummary();

    expect(global.fetch).toHaveBeenCalledWith('/api/dashboard/summary');
    expect(result).toEqual(summary);
  });

  it('should_throw_a_validation_message_when_createProject_returns_400_for_missing_name', async () => {
    const request: CreateProjectRequest = {
      name: '',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse({ message: 'name is required' }, false, 400)
    );

    await expect(createProject(request)).rejects.toThrow('name is required');
  });

  it('should_throw_a_validation_message_when_createProject_returns_400_for_overlong_name', async () => {
    const request: CreateProjectRequest = {
      name: 'A'.repeat(101),
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse({ message: 'name must not exceed 100 characters' }, false, 400)
    );

    await expect(createProject(request)).rejects.toThrow(
      'name must not exceed 100 characters'
    );
  });

  it('should_throw_a_validation_message_when_createProject_returns_400_for_invalid_status', async () => {
    const request = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Paused',
    } as unknown as CreateProjectRequest;

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(
        { message: 'status must be one of Active, At Risk, Blocked, On Hold' },
        false,
        400
      )
    );

    await expect(createProject(request)).rejects.toThrow(
      'status must be one of Active, At Risk, Blocked, On Hold'
    );
  });
});
