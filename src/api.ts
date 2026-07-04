import type {
  CreateProjectRequest,
  DashboardSummary,
  ProjectResponse,
} from './types';

const TODO_MESSAGE = 'TODO: implement ProjectPulse API module';

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  throw new Error(TODO_MESSAGE);
};

export const fetchProjectById = async (id: string): Promise<ProjectResponse> => {
  throw new Error(`${TODO_MESSAGE}: fetchProjectById(${id})`);
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  throw new Error(TODO_MESSAGE);
};

export const createProject = async (
  request: CreateProjectRequest
): Promise<ProjectResponse> => {
  throw new Error(`${TODO_MESSAGE}: createProject(${request.name})`);
};
