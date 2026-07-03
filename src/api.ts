import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (isRecord(body) && typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    return `Request failed with status ${response.status}`;
  }

  return `Request failed with status ${response.status}`;
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = init === undefined ? await fetch(input) : await fetch(input, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function getProjects(): Promise<ProjectResponse[]> {
  return requestJson<ProjectResponse[]>('/api/projects');
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(`/api/projects/${encodeURIComponent(id)}`);
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>('/api/dashboard/summary');
}
