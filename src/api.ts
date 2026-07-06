import type { CreateProjectRequest, DashboardSummary, ErrorResponse, ProjectResponse } from './types';

const API_BASE = process.env.REACT_APP_API_URL ?? '';

const buildUrl = (path: string): string => `${API_BASE}${path}`;

const readErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
  const errorBody: Partial<ErrorResponse> = await response.json();
  return errorBody.message ?? fallbackMessage;
};

export async function fetchProjects(): Promise<ProjectResponse[]> {
  const response = await fetch(buildUrl('/api/projects'));

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to fetch projects'));
  }

  const projects: ProjectResponse[] = await response.json();
  return projects;
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  const response = await fetch(buildUrl(`/api/projects/${encodeURIComponent(id)}`));

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to fetch project'));
  }

  const project: ProjectResponse = await response.json();
  return project;
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  const response = await fetch(buildUrl('/api/projects'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to create project'));
  }

  const project: ProjectResponse = await response.json();
  return project;
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(buildUrl('/api/dashboard/summary'));

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to fetch dashboard summary'));
  }

  const summary: DashboardSummary = await response.json();
  return summary;
}
