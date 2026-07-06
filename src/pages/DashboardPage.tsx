import './DashboardPage.css';
import { useEffect, useState } from 'react';
import { fetchDashboardSummary, fetchProjects } from '../api';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { ProjectTable } from '../components/ProjectTable';
import type { DashboardSummary, ProjectResponse } from '../types';

const emptySummary: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

export const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [summaryData, projectsData] = await Promise.all([
          fetchDashboardSummary(),
          fetchProjects(),
        ]);

        if (!isMounted) {
          return;
        }

        setSummary(summaryData);
        setProjects(projectsData.slice(0, 5));
      } catch (errorValue) {
        if (!isMounted) {
          return;
        }

        setError(errorValue instanceof Error ? errorValue.message : 'Failed to load dashboard');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pp-dashboard">
      <div className="pp-page-head">
        <h1>Dashboard</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <div className="pp-kpi-grid">
            <KpiCard label="Total Projects" value={summary.totalProjects} />
            <KpiCard label="Active" value={summary.active} />
            <KpiCard label="At Risk" value={summary.atRisk} />
            <KpiCard label="Blocked" value={summary.blocked} />
            <KpiCard label="On Hold" value={summary.onHold} />
          </div>

          <DataTable title="Recent Projects">
            <ProjectTable projects={projects} />
          </DataTable>
        </>
      )}
    </section>
  );
};
