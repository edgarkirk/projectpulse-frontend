import { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const API_BASE_URL = '/api';

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (typeof payload === 'object' && payload !== null && 'message' in payload) {
      const message = (payload as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }
  } catch {
    // Fall through to a generic error message below.
  }

  return `Request failed with status ${response.status}`;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = init === undefined ? await fetch(url) : await fetch(url, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data: unknown = await response.json();
  return data as T;
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  return requestJson<ProjectResponse[]>(`${API_BASE_URL}/projects`);
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(`${API_BASE_URL}/projects/${id}`);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>(`${API_BASE_URL}/dashboard/summary`);
}
