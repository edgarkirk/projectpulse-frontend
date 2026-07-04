export type ProjectStatus = 'Active' | 'At Risk' | 'Blocked' | 'On Hold';

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

const API_ROOT = '/api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (isRecord(payload) && typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof payload === 'string' && payload.length > 0) {
    return payload;
  }

  return fallback;
}

function parseProjectStatus(value: unknown): ProjectStatus {
  switch (value) {
    case 'Active':
    case 'At Risk':
    case 'Blocked':
    case 'On Hold':
      return value;
    default:
      throw new Error('Unexpected project status returned by the API');
  }
}

function parseProjectResponse(value: unknown): ProjectResponse {
  if (!isRecord(value)) {
    throw new Error('Unexpected project response returned by the API');
  }

  const { id, name, ownerName, status, createdAt } = value;

  if (
    typeof id !== 'string'
    || typeof name !== 'string'
    || typeof ownerName !== 'string'
    || typeof createdAt !== 'string'
  ) {
    throw new Error('Unexpected project response returned by the API');
  }

  return {
    id,
    name,
    ownerName,
    status: parseProjectStatus(status),
    createdAt,
  };
}

function parseDashboardSummary(value: unknown): DashboardSummary {
  if (!isRecord(value)) {
    throw new Error('Unexpected dashboard summary returned by the API');
  }

  const { totalProjects, active, atRisk, blocked, onHold } = value;

  if (
    typeof totalProjects !== 'number'
    || typeof active !== 'number'
    || typeof atRisk !== 'number'
    || typeof blocked !== 'number'
    || typeof onHold !== 'number'
  ) {
    throw new Error('Unexpected dashboard summary returned by the API');
  }

  return {
    totalProjects,
    active,
    atRisk,
    blocked,
    onHold,
  };
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (text.length === 0) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path: string, init?: RequestInit): Promise<{ response: Response; body: unknown }> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const body = await readBody(response);
  return { response, body };
}

function createRequestBody(request: CreateProjectRequest): CreateProjectRequest {
  return {
    name: request.name.trim(),
    ownerName: request.ownerName.trim(),
    status: request.status,
  };
}

export async function fetchProjects(): Promise<ProjectResponse[]> {
  const { response, body } = await request('/projects');

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Failed to load projects (${response.status})`));
  }

  if (!Array.isArray(body)) {
    throw new Error('Unexpected projects response returned by the API');
  }

  return body.map(parseProjectResponse);
}

export async function fetchProjectById(id: string): Promise<ProjectResponse> {
  const { response, body } = await request(`/projects/${id}`);

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Failed to load project ${id} (${response.status})`));
  }

  return parseProjectResponse(body);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { response, body } = await request('/dashboard/summary');

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Failed to load dashboard summary (${response.status})`));
  }

  return parseDashboardSummary(body);
}

export async function createProject(requestBody: CreateProjectRequest): Promise<ProjectResponse> {
  const { response, body } = await request('/projects', {
    method: 'POST',
    body: JSON.stringify(createRequestBody(requestBody)),
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Failed to create project (${response.status})`));
  }

  return parseProjectResponse(body);
}
