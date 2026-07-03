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
  const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();

  beforeEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: fetchMock,
    });
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('should_callGETProjects_when_getProjectsIsInvoked', async () => {
    const projects: ProjectResponse[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
        createdAt: '2026-07-03T12:00:00.000Z',
      },
    ];

    fetchMock.mockResolvedValueOnce(createJsonResponse(projects, 200));

    const result = await getProjects();

    expect(fetchMock).toHaveBeenCalledWith('/api/projects');
    expect(result).toEqual(projects);
  });

  it('should_callPOSTProjectsWithJSON_when_createProjectIsInvoked', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    const created: ProjectResponse = {
      id: '11111111-1111-1111-1111-111111111111',
      name: request.name,
      ownerName: request.ownerName,
      status: request.status,
      createdAt: '2026-07-03T12:00:00.000Z',
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(created, 201));

    const result = await createProject(request);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/projects',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
    );
    expect(result).toEqual(created);
  });

  it('should_throwMessage_when_createProjectReturns400', async () => {
    const request: CreateProjectRequest = {
      name: '',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse({ message: 'name is required' }, 400));

    await expect(createProject(request)).rejects.toThrow('name is required');
  });

  it('should_throwMessage_when_createProjectReturns409', async () => {
    const request: CreateProjectRequest = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse({ message: 'Project name is already taken' }, 409));

    await expect(createProject(request)).rejects.toThrow('Project name is already taken');
  });

  it('should_callGETProjectById_when_getProjectByIdIsInvoked', async () => {
    const project: ProjectResponse = {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'North Star',
      ownerName: 'Sam Lee',
      status: 'Blocked',
      createdAt: '2026-07-02T12:00:00.000Z',
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(project, 200));

    const result = await getProjectById(project.id);

    expect(fetchMock).toHaveBeenCalledWith(`/api/projects/${project.id}`);
    expect(result).toEqual(project);
  });

  it('should_throwMessage_when_getProjectByIdReturns404', async () => {
    const id = '33333333-3333-3333-3333-333333333333';

    fetchMock.mockResolvedValueOnce(createJsonResponse({ message: 'Project not found' }, 404));

    await expect(getProjectById(id)).rejects.toThrow('Project not found');
  });

  it('should_callGETDashboardSummary_when_getDashboardSummaryIsInvoked', async () => {
    const summary: DashboardSummary = {
      totalProjects: 6,
      active: 3,
      atRisk: 2,
      blocked: 1,
      onHold: 0,
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(summary, 200));

    const result = await getDashboardSummary();

    expect(fetchMock).toHaveBeenCalledWith('/api/dashboard/summary');
    expect(result).toEqual(summary);
  });
});
