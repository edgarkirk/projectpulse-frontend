import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

interface MessagePayload {
  message: unknown;
}

function hasMessage(payload: unknown): payload is MessagePayload {
  return typeof payload === 'object' && payload !== null && 'message' in payload;
}

function readErrorMessage(payload: unknown, fallbackMessage: string): string {
  if (hasMessage(payload) && typeof payload.message === 'string' && payload.message.trim().length > 0) {
    return payload.message;
  }

  return fallbackMessage;
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = init === undefined ? await fetch(input) : await fetch(input, init);

  if (!response.ok) {
    let errorBody: unknown = null;

    try {
      errorBody = await response.json();
    } catch {
      errorBody = null;
    }

    throw new Error(readErrorMessage(errorBody, response.statusText || 'Request failed'));
  }

  return await response.json();
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

export async function fetchProjects(): Promise<ProjectResponse[]> {
  return requestJson<ProjectResponse[]>('/api/projects');
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  return requestJson<ProjectResponse>(`/api/projects/${id}`);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>('/api/dashboard/summary');
}
