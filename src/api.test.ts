import { createProject, fetchDashboardSummary, fetchProjectById, fetchProjects } from './api';
import { buildProject, buildSummary, createJsonResponse, installFetchMock } from './testSupport';

describe('api client', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should_fetchProjects_fromTheProjectsEndpoint', async () => {
    const fetchMock = installFetchMock();
    const projects = [buildProject()];
    fetchMock.mockResolvedValueOnce(createJsonResponse(200, projects));

    await expect(fetchProjects()).resolves.toEqual(projects);
    expect(fetchMock).toHaveBeenCalledWith('/api/projects', undefined);
  });

  it('should_sendCreateProjectRequests_toTheProjectsEndpoint', async () => {
    const fetchMock = installFetchMock();
    const request = {
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active' as const,
    };
    const createdProject = buildProject(request);
    fetchMock.mockResolvedValueOnce(createJsonResponse(201, createdProject));

    await expect(createProject(request)).resolves.toEqual(createdProject);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/projects',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
    );
  });

  it('should_surfaceTheApiErrorMessage_whenProjectLookupFails', async () => {
    const fetchMock = installFetchMock();
    fetchMock.mockResolvedValueOnce(createJsonResponse(404, { message: 'Project not found' }));

    await expect(fetchProjectById('11111111-1111-4111-8111-111111111111')).rejects.toThrow(
      'Project not found'
    );
  });

  it('should_fetchDashboardSummary_fromTheSummaryEndpoint', async () => {
    const fetchMock = installFetchMock();
    const summary = buildSummary();
    fetchMock.mockResolvedValueOnce(createJsonResponse(200, summary));

    await expect(fetchDashboardSummary()).resolves.toEqual(summary);
    expect(fetchMock).toHaveBeenCalledWith('/api/dashboard/summary', undefined);
  });
});
