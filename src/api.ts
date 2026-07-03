import type { CreateProjectRequest, DashboardSummary, ErrorResponse, ProjectResponse } from './types';

const API_BASE_PATH = '/api';
const PROJECTS_PATH = `${API_BASE_PATH}/projects`;
const DASHBOARD_SUMMARY_PATH = `${API_BASE_PATH}/dashboard/summary`;

const isErrorResponse = (value: unknown): value is ErrorResponse => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as { message?: unknown };
  return typeof candidate.message === 'string';
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body: unknown = await response.json();
    if (isErrorResponse(body)) {
      return body.message;
    }
  } catch {
    return response.statusText || 'Request failed';
  }

  return response.statusText || 'Request failed';
};

const requestJson = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  return requestJson<ProjectResponse[]>(PROJECTS_PATH);
};

export const fetchProjectById = async (id: string): Promise<ProjectResponse> => {
  return requestJson<ProjectResponse>(`${PROJECTS_PATH}/${id}`);
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return requestJson<DashboardSummary>(DASHBOARD_SUMMARY_PATH);
};

export const createProject = async (request: CreateProjectRequest): Promise<ProjectResponse> => {
  return requestJson<ProjectResponse>(PROJECTS_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};
