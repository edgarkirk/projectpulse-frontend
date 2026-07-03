import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

function notImplemented(operation: string): never {
  throw new Error(`${operation} not implemented`);
}

export async function getProjects(): Promise<ProjectResponse[]> {
  return notImplemented('getProjects');
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  void id;
  return notImplemented('getProjectById');
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  void request;
  return notImplemented('createProject');
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return notImplemented('getDashboardSummary');
}
