import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

interface ErrorPayload {
  message?: string;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const data: T = await response.json();
  return data;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload: ErrorPayload = await response.json();
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      return payload.message;
    }
  } catch {
    // Fall through to a generic error message.
  }

  return `Request failed with status ${response.status}`;
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return readJsonResponse<T>(response);
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

export async function getProjects(): Promise<ReadonlyArray<ProjectResponse>> {
  return requestJson<ReadonlyArray<ProjectResponse>>('/api/projects');
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(`/api/projects/${encodeURIComponent(id)}`);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>('/api/dashboard/summary');
}
