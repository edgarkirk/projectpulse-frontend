import type { CreateProjectRequest, DashboardSummary, ErrorResponse, ProjectResponse } from './types/project';

const API_BASE = process.env.REACT_APP_API_URL ?? '';

const buildUrl = (path: string): string => `${API_BASE}${path}`;

const readErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
  const error: Partial<ErrorResponse> = await response.json();

  return error.message ?? fallbackMessage;
};

const requestJson = async <T>(path: string, init: RequestInit | undefined, fallbackMessage: string): Promise<T> => {
  const response = init ? await fetch(buildUrl(path), init) : await fetch(buildUrl(path));

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, fallbackMessage));
  }

  const data: T = await response.json();
  return data;
};

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  return requestJson<ProjectResponse[]>('/api/projects', undefined, 'Failed to fetch projects');
};

export const fetchProjectById = async (id: string): Promise<ProjectResponse> => {
  return requestJson<ProjectResponse>(`/api/projects/${id}`, undefined, 'Failed to fetch project');
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return requestJson<DashboardSummary>('/api/dashboard/summary', undefined, 'Failed to fetch dashboard summary');
};

export const createProject = async (request: CreateProjectRequest): Promise<ProjectResponse> => {
  return requestJson<ProjectResponse>('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }, 'Failed to create project');
};
