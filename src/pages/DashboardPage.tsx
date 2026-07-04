import React, { useEffect, useState } from 'react';
import { fetchDashboardSummary, fetchProjects, type DashboardSummary, type ProjectResponse } from '../api';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { StatusTag } from '../components/StatusTag';

const emptySummary: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

const tableHeaders = ['Name', 'Owner', 'Status'];

function ProjectRows({ projects }: { projects: ReadonlyArray<ProjectResponse> }): JSX.Element {
  return (
    <>
      {projects.map((project) => (
        <tr key={project.id}>
          <td>{project.name}</td>
          <td>{project.ownerName}</td>
          <td><StatusTag status={project.status} /></td>
        </tr>
      ))}
    </>
  );
}

export function DashboardPage(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard(): Promise<void> {
      try {
        const [summaryResponse, projectsResponse] = await Promise.all([
          fetchDashboardSummary(),
          fetchProjects(),
        ]);

        if (!isMounted) {
          return;
        }

        setSummary(summaryResponse);
        setProjects(projectsResponse.slice(0, 5));
        setErrorMessage('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load dashboard');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="pp-page">
      <section className="pp-page__intro">
        <h1>Dashboard</h1>
        <p>Monitor project health and the most recent activity.</p>
      </section>

      {errorMessage.length > 0 ? <div role="alert" className="pp-error-banner">{errorMessage}</div> : null}

      {isLoading ? <div className="pp-loading" aria-live="polite">Loading dashboard...</div> : null}

      <section className="pp-kpi-grid" aria-label="dashboard kpis">
        <KpiCard label="Total Projects" value={summary.totalProjects} />
        <KpiCard label="Active" value={summary.active} />
        <KpiCard label="At Risk" value={summary.atRisk} />
        <KpiCard label="Blocked" value={summary.blocked} />
        <KpiCard label="On Hold" value={summary.onHold} />
      </section>

      <DataTable title="Recent projects" headers={tableHeaders}>
        <ProjectRows projects={projects} />
      </DataTable>
    </main>
  );
}
