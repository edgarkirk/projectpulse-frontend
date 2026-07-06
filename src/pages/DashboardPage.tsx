import { useEffect, useState } from 'react';
import './DashboardPage.css';
import { fetchDashboardSummary, fetchProjects } from '../api';
import { KpiCard } from '../components/KpiCard';
import { ProjectTable } from '../components/ProjectTable';
import type { DashboardSummary, ProjectResponse } from '../types';

export const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryData, projectData] = await Promise.all([fetchDashboardSummary(), fetchProjects()]);
        setSummary(summaryData);
        setProjects(projectData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (summary === null) {
    return <p role="alert">Dashboard data is unavailable.</p>;
  }

  return (
    <section className="pp-dashboard">
      <div className="pp-page-head">
        <h1>Dashboard</h1>
      </div>
      <div className="pp-kpi-grid">
        <KpiCard label="Total Projects" count={summary.totalProjects} />
        <KpiCard label="Active" count={summary.active} />
        <KpiCard label="At Risk" count={summary.atRisk} />
        <KpiCard label="Blocked" count={summary.blocked} />
        <KpiCard label="On Hold" count={summary.onHold} />
      </div>
      <ProjectTable title="Recent Projects" projects={projects.slice(0, 5)} emptyMessage="No projects found" compactStatus />
    </section>
  );
};
