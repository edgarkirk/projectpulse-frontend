import type { DashboardSummary, ProjectResponse, ProjectStatus } from './types';

export const buildProject = (
  overrides: Partial<ProjectResponse> = {}
): ProjectResponse => {
  const defaultStatus: ProjectStatus = 'Active';

  return {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Atlas Migration',
    ownerName: 'Jane Doe',
    status: defaultStatus,
    createdAt: '2026-07-03T09:20:00.000Z',
    ...overrides,
  };
};

export const buildSummary = (
  overrides: Partial<DashboardSummary> = {}
): DashboardSummary => {
  return {
    totalProjects: 6,
    active: 3,
    atRisk: 2,
    blocked: 1,
    onHold: 0,
    ...overrides,
  };
};

export const createJsonResponse = (status: number, body: unknown): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const installFetchMock = (): jest.MockedFunction<typeof fetch> => {
  const fetchMock: jest.MockedFunction<typeof fetch> = jest.fn();

  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: fetchMock,
  });

  return fetchMock;
};
