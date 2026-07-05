import { useLayoutEffect, useState } from 'react';
import { getDashboardSummary, getProjects } from '../api';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { StatusTag } from '../components/StatusTag';
import type { DashboardSummary, ProjectResponse } from '../types';
import './DashboardPage.css';

const initialSummary: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

export function DashboardPage(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    const loadDashboard = async (): Promise<void> => {
      try {
        const [summaryData, projectsData] = await Promise.all([getDashboardSummary(), getProjects()]);

        if (isMounted) {
          setSummary(summaryData);
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        }
      } catch {
        if (isMounted) {
          setSummary(initialSummary);
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentProjects = projects.slice(0, 5).map((project) => ({
    key: project.id,
    cells: [project.name, project.ownerName, <StatusTag key={project.id} status={project.status} />],
  }));

  return (
    <section aria-labelledby="dashboard-title">
      <div className="pp-page-head">
        <h1 id="dashboard-title">Dashboard</h1>
      </div>
      {isLoaded ? (
        <>
          <div className="pp-kpi-grid">
            <KpiCard title="Total Projects" value={summary.totalProjects} />
            <KpiCard title="Active" value={summary.active} />
            <KpiCard title="At Risk" value={summary.atRisk} />
            <KpiCard title="Blocked" value={summary.blocked} />
            <KpiCard title="On Hold" value={summary.onHold} />
          </div>
          <DataTable
            caption="Recent Projects"
            columns={[
              { header: 'Name' },
              { header: 'Owner' },
              { header: 'Status' },
            ]}
            rows={recentProjects}
          />
        </>
      ) : null}
    </section>
  );
}
