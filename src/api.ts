import type { CreateProjectRequest, DashboardSummary, ProjectResponse } from './types';

const unimplemented = (): never => {
  throw new Error('Not implemented');
};

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  return unimplemented();
};

export const fetchProjectById = async (_id: string): Promise<ProjectResponse> => {
  return unimplemented();
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return unimplemented();
};

export const createProject = async (_request: CreateProjectRequest): Promise<ProjectResponse> => {
  return unimplemented();
};
