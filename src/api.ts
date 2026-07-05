import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types/project';

const notImplemented = async (): Promise<never> => {
  throw new Error('API module is not implemented yet');
};

export async function fetchProjects(): Promise<ProjectResponse[]> {
  return notImplemented();
}

export async function fetchProjectById(_id: string): Promise<ProjectResponse> {
  return notImplemented();
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return notImplemented();
}

export async function createProject(_request: CreateProjectRequest): Promise<ProjectResponse> {
  return notImplemented();
}
