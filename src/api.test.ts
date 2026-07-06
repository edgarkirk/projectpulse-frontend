import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

function mockJsonResponse<T>(body: T, ok: boolean, status: number): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('fetchProjects', () => {
    it('should return projects on success when the API responds with data', async () => {
      const projects: ProjectResponse[] = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Atlas Migration',
          ownerName: 'Jane Doe',
          status: 'Active',
          createdAt: '2026-07-05T10:00:00.000Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(mockJsonResponse(projects, true, 200));

      const result = await fetchProjects();

      expect(result).toEqual(projects);
      expect(mockFetch).toHaveBeenCalledWith('/api/projects');
    });

    it('should throw the API error message when the list request fails', async () => {
      mockFetch.mockResolvedValueOnce(
        mockJsonResponse({ message: 'Project list unavailable' }, false, 500)
      );

      await expect(fetchProjects()).rejects.toThrow('Project list unavailable');
    });
  });

  describe('fetchProjectById', () => {
    it('should return a project when the UUID exists', async () => {
      const project: ProjectResponse = {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Website Redesign',
        ownerName: 'Sam Lee',
        status: 'At Risk',
        createdAt: '2026-07-05T11:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce(mockJsonResponse(project, true, 200));

      const result = await fetchProjectById(project.id);

      expect(result).toEqual(project);
      expect(mockFetch).toHaveBeenCalledWith(`/api/projects/${project.id}`);
    });

    it('should throw the not-found message when the UUID does not exist', async () => {
      const projectId = '33333333-3333-3333-3333-333333333333';

      mockFetch.mockResolvedValueOnce(
        mockJsonResponse({ message: 'Project not found' }, false, 404)
      );

      await expect(fetchProjectById(projectId)).rejects.toThrow('Project not found');
    });
  });

  describe('createProject', () => {
    it('should post the request body and return the created project on success', async () => {
      const request: CreateProjectRequest = {
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      };
      const createdProject: ProjectResponse = {
        id: '44444444-4444-4444-4444-444444444444',
        name: request.name,
        ownerName: request.ownerName,
        status: request.status,
        createdAt: '2026-07-05T12:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce(mockJsonResponse(createdProject, true, 201));

      const result = await createProject(request);

      expect(result).toEqual(createdProject);
      expect(mockFetch).toHaveBeenCalledWith('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should throw the duplicate-name message when the API rejects a duplicate project', async () => {
      const request: CreateProjectRequest = {
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      };

      mockFetch.mockResolvedValueOnce(
        mockJsonResponse({ message: 'Project name already exists' }, false, 409)
      );

      await expect(createProject(request)).rejects.toThrow('Project name already exists');
    });
  });

  describe('fetchDashboardSummary', () => {
    it('should return the dashboard counts on success', async () => {
      const summary: DashboardSummary = {
        totalProjects: 6,
        active: 3,
        atRisk: 2,
        blocked: 1,
        onHold: 0,
      };

      mockFetch.mockResolvedValueOnce(mockJsonResponse(summary, true, 200));

      const result = await fetchDashboardSummary();

      expect(result).toEqual(summary);
      expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/summary');
    });

    it('should throw the network error when the request cannot complete', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Dashboard summary unavailable'));

      await expect(fetchDashboardSummary()).rejects.toThrow('Dashboard summary unavailable');
    });
  });
});
