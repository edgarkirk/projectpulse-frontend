import { useEffect, useState } from 'react';
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
        const [nextSummary, nextProjects] = await Promise.all([
          fetchDashboardSummary(),
          fetchProjects(),
        ]);

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
      <main>
        <h1>Dashboard</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (!summary) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>Loading dashboard...</p>
      </main>
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
    <main>
      <h1>Dashboard</h1>
      <section aria-label="dashboard kpis">
        {kpiCards.map((card) => (
          <article key={card.label} aria-label={card.label}>
            <h2>{card.label}</h2>
            <p>{card.value}</p>
          </article>
        ))}
      </section>

      <section aria-label="recent projects">
        <h2>Recent Projects</h2>
        <ProjectList projects={recentProjects} />
      </section>
    </main>
  );
}
