import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

function mockJsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('api module', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the created project and send a POST request when the project name is unique', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };
    const createdProject: ProjectResponse = {
      id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000001',
      name: request.name,
      ownerName: request.ownerName,
      status: request.status,
      createdAt: '2026-07-05T09:44:48.000Z',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse(createdProject, 201)
    );

    await expect(createProject(request)).resolves.toEqual(createdProject);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/projects',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
    );
  });

  it('should surface the duplicate-name error when the server returns 409', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse({ message: 'Project name is already taken' }, 409)
    );

    await expect(createProject(request)).rejects.toThrow(/project name is already taken/i);
  });

  it('should return projects in newest-first order when the API responds with sorted data', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000003',
        name: 'Gamma',
        ownerName: 'Sam',
        status: 'On Hold',
        createdAt: '2026-07-05T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000002',
        name: 'Beta',
        ownerName: 'Avery',
        status: 'Blocked',
        createdAt: '2026-07-04T09:44:48.000Z',
      },
      {
        id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000001',
        name: 'Alpha',
        ownerName: 'Jordan',
        status: 'Active',
        createdAt: '2026-07-03T09:44:48.000Z',
      },
    ];

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse(projects, 200)
    );

    await expect(fetchProjects()).resolves.toEqual(projects);
    expect(global.fetch).toHaveBeenCalledWith('/api/projects');
  });

  it('should return the matching project when the project id exists', async () => {
    const project: ProjectResponse = {
      id: '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000004',
      name: 'Found Project',
      ownerName: 'Morgan',
      status: 'At Risk',
      createdAt: '2026-07-03T09:44:48.000Z',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse(project, 200)
    );

    await expect(fetchProjectById(project.id)).resolves.toEqual(project);
    expect(global.fetch).toHaveBeenCalledWith(`/api/projects/${project.id}`);
  });

  it('should surface the not-found error when the server returns 404', async () => {
    const projectId = '8c2d2df1-2f8c-4d35-9c4d-2d2e1c000099';

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse({ message: 'Project not found' }, 404)
    );

    await expect(fetchProjectById(projectId)).rejects.toThrow(/project not found/i);
  });

  it('should return dashboard summary counts from the API response', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse(summary, 200)
    );

    await expect(fetchDashboardSummary()).resolves.toEqual(summary);
    expect(global.fetch).toHaveBeenCalledWith('/api/dashboard/summary');
  });

  it('should surface the required-name validation error when the name is blank', async () => {
    const request: CreateProjectRequest = {
      name: '',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse({ message: 'name is required' }, 400)
    );

    await expect(createProject(request)).rejects.toThrow(/name is required/i);
  });

  it('should surface the name-length validation error when the project name exceeds 100 characters', async () => {
    const request: CreateProjectRequest = {
      name: 'A'.repeat(101),
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse({ message: 'name must be at most 100 characters' }, 400)
    );

    await expect(createProject(request)).rejects.toThrow(/name must be at most 100 characters/i);
  });

  it('should surface the owner-length validation error when the owner name exceeds 100 characters', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'B'.repeat(101),
      status: 'Active',
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse({ message: 'ownerName must be at most 100 characters' }, 400)
    );

    await expect(createProject(request)).rejects.toThrow(/ownername must be at most 100 characters/i);
  });

  it('should surface the invalid-status validation error when the status is outside the allowed values', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockJsonResponse({ message: 'status must be one of Active, At Risk, Blocked, On Hold' }, 400)
    );

    const invalidRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Archived',
    } as unknown as CreateProjectRequest;

    await expect(createProject(invalidRequest)).rejects.toThrow(/status must be one of active, at risk, blocked, on hold/i);
  });
});
