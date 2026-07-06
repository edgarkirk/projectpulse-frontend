import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

function notImplemented(functionName: string): never {
  throw new Error(`${functionName} is not implemented`);
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  return notImplemented('fetchProjects');
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  void id;
  return notImplemented('fetchProjectById');
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  void request;
  return notImplemented('createProject');
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return notImplemented('fetchDashboardSummary');
}
