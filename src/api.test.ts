import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

global.fetch = mockFetch;

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return project data when fetching the project list succeeds', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-06T09:00:00.000Z',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => projects,
    } as Response);

    const result = await fetchProjects();

    expect(result).toEqual(projects);
    expect(mockFetch).toHaveBeenCalledWith('/api/projects');
  });

  it('should throw the API error message when fetching the project list fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Project list failed' }),
    } as Response);

    await expect(fetchProjects()).rejects.toThrow('Project list failed');
  });

  it('should request a project by id from the project detail endpoint', async () => {
    const project: ProjectResponse = {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Nova Launch',
      ownerName: 'John Smith',
      status: 'At Risk',
      createdAt: '2026-07-06T10:00:00.000Z',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => project,
    } as Response);

    const result = await fetchProjectById(project.id);

    expect(result).toEqual(project);
    expect(mockFetch).toHaveBeenCalledWith(`/api/projects/${project.id}`);
  });

  it('should throw the API error message when fetching a missing project fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Project not found' }),
    } as Response);

    await expect(fetchProjectById('33333333-3333-4333-8333-333333333333')).rejects.toThrow(
      'Project not found'
    );
  });

  it('should post create project requests to the projects endpoint', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };
    const created: ProjectResponse = {
      id: '44444444-4444-4444-8444-444444444444',
      ...request,
      createdAt: '2026-07-06T11:00:00.000Z',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => created,
    } as Response);

    const result = await createProject(request);

    expect(result).toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  });

  it('should throw the API error message when create project returns a duplicate error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Project name already taken' }),
    } as Response);

    await expect(
      createProject({
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      })
    ).rejects.toThrow('Project name already taken');
  });

  it('should request the dashboard summary endpoint and parse the counts', async () => {
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

    const result = await fetchDashboardSummary();

    expect(result).toEqual(summary);
    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/summary');
  });

  it('should throw the API error message when the dashboard summary request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Dashboard summary failed' }),
    } as Response);

    await expect(fetchDashboardSummary()).rejects.toThrow('Dashboard summary failed');
  });
});
