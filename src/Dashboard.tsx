import { useEffect, useState } from 'react';
import './Dashboard.css';
import { fetchDashboardSummary, fetchProjects } from './api';
import { ProjectList } from './ProjectList';
import { DashboardSummary, ProjectResponse } from './types';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load dashboard';
}

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [nextSummary, nextProjects] = await Promise.all([fetchDashboardSummary(), fetchProjects()]);

        if (!isMounted) {
          return;
        }

        setSummary(nextSummary);
        setProjects(nextProjects);
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError));
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <section className="pp-dashboard">
        <div className="pp-page-head">
          <h1>Dashboard</h1>
        </div>
        <p role="alert" className="pp-msg pp-msg--error">
          {error}
        </p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="pp-dashboard">
        <div className="pp-page-head">
          <h1>Dashboard</h1>
        </div>
        <p>Loading dashboard...</p>
      </section>
    );
  }

  const recentProjects = projects.slice(0, 5);
  const kpiCards = [
    { label: 'Total Projects', value: summary.totalProjects },
    { label: 'Active', value: summary.active },
    { label: 'At Risk', value: summary.atRisk },
    { label: 'Blocked', value: summary.blocked },
    { label: 'On Hold', value: summary.onHold },
  ];

  return (
    <section className="pp-dashboard">
      <div className="pp-page-head">
        <h1>Dashboard</h1>
      </div>

      <section aria-label="dashboard kpis" className="pp-kpi-grid">
        {kpiCards.map((card) => (
          <article key={card.label} className="pp-kpi" aria-label={card.label}>
            <h2 className="pp-kpi__label">{card.label}</h2>
            <p className="pp-kpi__value">{card.value}</p>
          </article>
        ))}
      </section>

      <section aria-label="recent projects" className="pp-table-wrap">
        <h3 className="pp-table-title">Recent Projects</h3>
        <ProjectList projects={recentProjects} />
      </section>
    </section>
  );
}
