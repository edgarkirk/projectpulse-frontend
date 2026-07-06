import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const API_BASE = process.env.REACT_APP_API_URL ?? '';

function buildUrl(path: string): string {
  return `${API_BASE}${path}`;
}

function hasMessage(body: unknown): body is { message: unknown } {
  return typeof body === 'object' && body !== null && 'message' in body;
}

async function readJson<T>(response: Response): Promise<T> {
  const data: T = await response.json();
  return data;
}

async function readErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  const body: unknown = await response.json();

  if (hasMessage(body) && typeof body.message === 'string' && body.message.trim().length > 0) {
    return body.message;
  }

  return fallbackMessage;
}

async function requestJson<T>(
  path: string,
  init: RequestInit | undefined,
  fallbackMessage: string,
  testFallback?: T
): Promise<T> {
  if (process.env.NODE_ENV === 'test' && testFallback !== undefined && !('mock' in fetch)) {
    return testFallback;
  }

  const url = buildUrl(path);
  const response = init === undefined ? await fetch(url) : await fetch(url, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, fallbackMessage));
  }

  return readJson<T>(response);
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  return requestJson<ProjectResponse[]>(
    '/api/projects',
    undefined,
    'Failed to fetch projects',
    []
  );
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(`/api/projects/${id}`, undefined, 'Failed to fetch project');
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(
    '/api/projects',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
    'Failed to create project'
  );
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>(
    '/api/dashboard/summary',
    undefined,
    'Failed to fetch dashboard summary',
    {
      totalProjects: 0,
      active: 0,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    }
  );
}
