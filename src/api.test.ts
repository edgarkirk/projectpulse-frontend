import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return projects from GET /api/projects ordered newest first', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-03T12:00:00.000Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Beacon Launch',
        ownerName: 'John Smith',
        status: 'At Risk',
        createdAt: '2026-07-02T12:00:00.000Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Cinder Rollout',
        ownerName: 'Ada Lovelace',
        status: 'Blocked',
        createdAt: '2026-07-01T12:00:00.000Z',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => projects,
    } as Response);

    await expect(fetchProjects()).resolves.toEqual(projects);
    expect(mockFetch).toHaveBeenCalledWith('/api/projects');
  });

  it('should send a POST request with create project payload', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    const createdProject: ProjectResponse = {
      id: '22222222-2222-2222-2222-222222222222',
      name: request.name,
      ownerName: request.ownerName,
      status: request.status,
      createdAt: '2026-07-02T12:00:00.000Z',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => createdProject,
    } as Response);

    await expect(createProject(request)).resolves.toEqual(createdProject);
    expect(mockFetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  });

  it('should throw the duplicate project message on HTTP 409', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ message: 'Project name Atlas Migration is already taken' }),
    } as Response);

    await expect(createProject(request)).rejects.toThrow('Project name Atlas Migration is already taken');
  });

  it('should throw the required name message on HTTP 400 for an empty name', async () => {
    const request: CreateProjectRequest = {
      name: '',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Project name is required' }),
    } as Response);

    await expect(createProject(request)).rejects.toThrow('Project name is required');
  });

  it('should throw the max length message on HTTP 400 for a long name', async () => {
    const request: CreateProjectRequest = {
      name: 'A'.repeat(101),
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Project name must be 100 characters or fewer' }),
    } as Response);

    await expect(createProject(request)).rejects.toThrow('Project name must be 100 characters or fewer');
  });

  it('should throw the invalid status message on HTTP 400', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Status must be one of: Active, At Risk, Blocked, On Hold' }),
    } as Response);

    await expect(createProject(request)).rejects.toThrow('Status must be one of: Active, At Risk, Blocked, On Hold');
  });

  it('should return a project from GET /api/projects/{id}', async () => {
    const project: ProjectResponse = {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-03T12:00:00.000Z',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => project,
    } as Response);

    await expect(fetchProjectById(project.id)).resolves.toEqual(project);
    expect(mockFetch).toHaveBeenCalledWith(`/api/projects/${project.id}`);
  });

  it('should throw the not found message on HTTP 404', async () => {
    const id = '44444444-4444-4444-4444-444444444444';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Project not found' }),
    } as Response);

    await expect(fetchProjectById(id)).rejects.toThrow('Project not found');
  });

  it('should return dashboard summary from GET /api/dashboard/summary', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => summary,
    } as Response);

    await expect(fetchDashboardSummary()).resolves.toEqual(summary);
    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/summary');
  });
});
