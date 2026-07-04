import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './api';
import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';

function createJsonResponse(body: unknown, init: { ok: boolean; status: number }): Response {
  return {
    ok: init.ok,
    status: init.status,
    text: async () => JSON.stringify(body),
  } as Response;
}

const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('api module', () => {
  test('should post the project payload when createProject is called', async () => {
    const payload: CreateProjectRequest = {
      name: '  Atlas Migration  ',
      ownerName: '  Jane Doe  ',
      status: 'Active',
    };
    const createdProject: ProjectResponse = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-03T12:00:00.000Z',
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(createdProject, { ok: true, status: 201 }));

    const response = await createProject(payload);

    expect(fetchMock).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      }),
    }));
    expect(response).toEqual(createdProject);
  });

  test('should return a parsed project list when fetchProjects resolves', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-03T12:00:00.000Z',
      },
    ];

    fetchMock.mockResolvedValueOnce(createJsonResponse(projects, { ok: true, status: 200 }));

    const result = await fetchProjects();

    expect(result).toEqual(projects);
    expect(fetchMock).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
      headers: expect.objectContaining({ Accept: 'application/json' }),
    }));
  });

  test('should return dashboard counts from fetchDashboardSummary', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(summary, { ok: true, status: 200 }));

    const result = await fetchDashboardSummary();

    expect(result).toEqual(summary);
  });

  test('should surface the API error message when createProject receives a validation response', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ message: 'Name is required' }, { ok: false, status: 400 }));

    await expect(createProject({
      name: '',
      ownerName: 'Jane Doe',
      status: 'Active',
    })).rejects.toThrow('Name is required');
  });

  test('should resolve project by id when fetchProjectById is called', async () => {
    const project: ProjectResponse = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-03T12:00:00.000Z',
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(project, { ok: true, status: 200 }));

    const result = await fetchProjectById('00000000-0000-0000-0000-000000000001');

    expect(result.id).toBe('00000000-0000-0000-0000-000000000001');
  });
});
