import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { fetchDashboardSummary, fetchProjects } from '../api';
import { DataTable, type DataTableColumn } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { StatusTag } from '../components/StatusTag';
import type { DashboardSummary, ProjectResponse } from '../types';

const projectColumns: Array<DataTableColumn<ProjectRow>> = [
  { key: 'name', header: 'Name' },
  { key: 'ownerName', header: 'Owner' },
  { key: 'status', header: 'Status' },
];

interface ProjectRow extends Record<string, ReactNode> {
  id: string;
  name: string;
  ownerName: string;
  status: ReactNode;
}

const emptySummary: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

const byNewestFirst = (left: ProjectResponse, right: ProjectResponse): number => {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
};

export const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async (): Promise<void> => {
      try {
        const [summaryResponse, projectsResponse] = await Promise.all([
          fetchDashboardSummary(),
          fetchProjects(),
        ]);

        if (!isActive) {
          return;
        }

        setSummary(summaryResponse);
        setProjects(projectsResponse);
        setErrorMessage(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const recentProjects = useMemo(() => {
    return [...projects].sort(byNewestFirst).slice(0, 5);
  }, [projects]);

  const projectRows = useMemo<ProjectRow[]>(() => {
    return recentProjects.map((project) => ({
      id: project.id,
      name: project.name,
      ownerName: project.ownerName,
      status: <StatusTag status={project.status} />,
    }));
  }, [recentProjects]);

  if (isLoading) {
    return (
      <main aria-busy="true">
        <p role="status" aria-live="polite">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Dashboard</h1>
      {errorMessage ? <div role="alert">{errorMessage}</div> : null}
      <section aria-label="Project metrics">
        <KpiCard label="Total Projects" value={summary.totalProjects} />
        <KpiCard label="Active" value={summary.active} />
        <KpiCard label="At Risk" value={summary.atRisk} />
        <KpiCard label="Blocked" value={summary.blocked} />
        <KpiCard label="On Hold" value={summary.onHold} />
      </section>
      <section>
        <h2>Recent Projects</h2>
        <DataTable<ProjectRow>
          ariaLabel="Recent projects"
          columns={projectColumns}
          rows={projectRows}
          emptyMessage="No projects yet."
          getRowKey={(row) => row.id}
        />
      </section>
    </main>
  );
};
