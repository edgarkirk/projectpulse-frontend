import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

export async function fetchProjects(): Promise<ProjectResponse[]> {
  throw new Error('fetchProjects is not implemented yet');
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  throw new Error(`fetchProjectById is not implemented yet for ${id}`);
}

export async function createProject(
  request: CreateProjectRequest
): Promise<ProjectResponse> {
  throw new Error(`createProject is not implemented yet for ${request.name}`);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  throw new Error('fetchDashboardSummary is not implemented yet');
}
