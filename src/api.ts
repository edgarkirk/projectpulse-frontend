import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const TODO_MESSAGE = 'TODO: implement api module';

function throwTodo(functionName: string): never {
  throw new Error(`${TODO_MESSAGE}: ${functionName}`);
}

export async function createProject(_request: CreateProjectRequest): Promise<ProjectResponse> {
  return throwTodo('createProject');
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  return throwTodo('fetchProjects');
}

export async function fetchProjectById(_id: string): Promise<ProjectResponse> {
  return throwTodo('fetchProjectById');
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return throwTodo('fetchDashboardSummary');
}
