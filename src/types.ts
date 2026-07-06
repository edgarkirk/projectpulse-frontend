export type ProjectStatus = 'Active' | 'At Risk' | 'Blocked' | 'On Hold';
export type RoutePath = '#/dashboard' | '#/projects';

export interface CreateProjectRequest {
  name: string;
  ownerName: string;
  status: ProjectStatus;
}

export interface ProjectResponse {
  id: string;
  name: string;
  ownerName: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface DashboardSummary {
  totalProjects: number;
  active: number;
  atRisk: number;
  blocked: number;
  onHold: number;
}

export interface ErrorResponse {
  message: string;
}
