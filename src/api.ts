import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

export async function createProject(_request: CreateProjectRequest): Promise<ProjectResponse> {
  throw new Error('TODO: implement createProject');
}

export async function getProjects(): Promise<ReadonlyArray<ProjectResponse>> {
  throw new Error('TODO: implement getProjects');
}

export async function getProjectById(_id: string): Promise<ProjectResponse> {
  throw new Error('TODO: implement getProjectById');
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  throw new Error('TODO: implement getDashboardSummary');
}
