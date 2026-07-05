import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types/project';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

global.fetch = mockFetch;

const projectId = '3a72c9a0-3f3c-4f6a-9f55-3f4f5f7a5b11';
const project: ProjectResponse = {
  id: projectId,
  name: 'Atlas Migration',
  ownerName: 'Jane Doe',
  status: 'Active',
  createdAt: '2026-07-03T09:20:00.000Z',
};

const createRequest: CreateProjectRequest = {
  name: 'Atlas Migration',
  ownerName: 'Jane Doe',
  status: 'Active',
};

const summary: DashboardSummary = {
  totalProjects: 6,
  active: 3,
  atRisk: 2,
  blocked: 1,
  onHold: 0,
};

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return projects on success when fetching the project list', async () => {
    const projects: ProjectResponse[] = [project];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => projects,
    } as Response);

    const result = await fetchProjects();

    expect(result).toEqual(projects);
    expect(mockFetch).toHaveBeenCalledWith('/api/projects');
  });

  it('should throw the API message when fetching the project list fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to load projects' }),
    } as Response);

    await expect(fetchProjects()).rejects.toThrow('Failed to load projects');
  });

  it('should return a project when fetching by id succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => project,
    } as Response);

    const result = await fetchProjectById(projectId);

    expect(result).toEqual(project);
    expect(mockFetch).toHaveBeenCalledWith(`/api/projects/${projectId}`);
  });

  it('should throw the API message when a project is not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Project was not found' }),
    } as Response);

    await expect(fetchProjectById(projectId)).rejects.toThrow('Project was not found');
  });

  it('should return the dashboard summary on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => summary,
    } as Response);

    const result = await fetchDashboardSummary();

    expect(result).toEqual(summary);
    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/summary');
  });

  it('should throw the API message when the dashboard summary request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Dashboard summary unavailable' }),
    } as Response);

    await expect(fetchDashboardSummary()).rejects.toThrow('Dashboard summary unavailable');
  });

  it('should create a project on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => project,
    } as Response);

    const result = await createProject(createRequest);

    expect(result).toEqual(project);
    expect(mockFetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createRequest),
    });
  });

  it('should throw the API message when create project fails with a duplicate name', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Project name is already taken' }),
    } as Response);

    await expect(createProject(createRequest)).rejects.toThrow('Project name is already taken');
  });
});
