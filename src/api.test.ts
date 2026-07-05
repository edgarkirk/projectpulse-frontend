import { createProject, getDashboardSummary, getProjectById, getProjects } from './api';
import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

function createJsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('api', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should post the create project payload and return the created project when the request succeeds', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    const createdProject: ProjectResponse = {
      id: 'b6f8d7b1-4d66-4a69-9d9e-2d2f4a8af0b0',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-05T10:00:00.000Z',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(createdProject, 201)
    );

    await expect(createProject(request)).resolves.toEqual(createdProject);

    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/projects');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(JSON.stringify(request));
  });

  it('should surface the validation error message when create project fails with 400', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse({ message: 'Name is required' }, 400)
    );

    await expect(createProject(request)).rejects.toThrow('Name is required');
  });

  it('should return all projects from the projects list endpoint', async () => {
    const projects: ReadonlyArray<ProjectResponse> = [
      {
        id: '4c17d6da-0f5f-4d9f-bd8d-0a8ef0b6e001',
        name: 'Orion Launch',
        ownerName: 'Ana Smith',
        status: 'At Risk',
        createdAt: '2026-07-05T09:30:00.000Z',
      },
      {
        id: 'a2ccce7b-0b4d-4d1b-9e5c-2c2e5e8b1002',
        name: 'Luna Rollout',
        ownerName: 'Ben Wright',
        status: 'Blocked',
        createdAt: '2026-07-05T08:30:00.000Z',
      },
    ];

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(projects, 200)
    );

    await expect(getProjects()).resolves.toEqual(projects);
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/projects');
  });

  it('should surface the not found message when fetching a missing project by id', async () => {
    const projectId = '7dc9cb7c-51c8-4d3e-88e1-98dc4fd0b7f0';

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse({ message: 'Project not found' }, 404)
    );

    await expect(getProjectById(projectId)).rejects.toThrow('Project not found');
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`/api/projects/${projectId}`);
  });

  it('should return the dashboard summary when the summary endpoint succeeds', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      createJsonResponse(summary, 200)
    );

    await expect(getDashboardSummary()).resolves.toEqual(summary);
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/dashboard/summary');
  });
});
