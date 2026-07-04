import type {
  CreateProjectRequest,
  DashboardSummary,
  ProjectResponse,
} from './types';

const API_BASE = '/api';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const body: unknown = await response.json();

  if (isRecord(body) && typeof body.message === 'string' && body.message.trim().length > 0) {
    return body.message;
  }

  return `Request failed with status ${response.status}`;
};

const requestJson = async <T,>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const response = init === undefined ? await fetch(input) : await fetch(input, init);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body: T = await response.json();
  return body;
};

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  return requestJson<ProjectResponse[]>(`${API_BASE}/projects`);
};

export const fetchProjectById = async (id: string): Promise<ProjectResponse> => {
  return requestJson<ProjectResponse>(`${API_BASE}/projects/${id}`);
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return requestJson<DashboardSummary>(`${API_BASE}/dashboard/summary`);
};

export const createProject = async (
  request: CreateProjectRequest
): Promise<ProjectResponse> => {
  return requestJson<ProjectResponse>(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};
