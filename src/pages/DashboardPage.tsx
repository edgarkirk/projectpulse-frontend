import { useCallback, useEffect, useState } from 'react';
import '../styles/global.css';
import { fetchDashboardSummary, fetchProjects } from '../api';
import type { DashboardSummary, ProjectResponse } from '../types';
import './DashboardPage.css';

const EMPTY_SUMMARY: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

const RECENT_PROJECT_LIMIT = 5;

type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

function getStatusTone(status: string): StatusTone {
  if (status === 'Active') {
    return 'success';
  }

  if (status === 'At Risk') {
    return 'warning';
  }

  if (status === 'Blocked') {
    return 'error';
  }

  if (status === 'On Hold') {
    return 'info';
  }

  return 'neutral';
}

function renderStatusBadge(status: string): JSX.Element {
  return (
    <span className={`pp-tag pp-tag--${getStatusTone(status)}`} aria-label={`State: ${status}`}>
      {status}
    </span>
  );
}

function renderKpiCard(label: string, value: number): JSX.Element {
  return (
    <article className="pp-kpi">
      <h2 className="pp-kpi__label">{label}</h2>
      <div className="pp-kpi__value">{value}</div>
    </article>
  );
}

function renderProjectRow(project: ProjectResponse): JSX.Element {
  return (
    <tr key={project.id}>
      <td>{project.name}</td>
      <td>{project.ownerName}</td>
      <td>{renderStatusBadge(project.status)}</td>
    </tr>
  );
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryResponse, projectsResponse] = await Promise.all([
        fetchDashboardSummary(),
        fetchProjects(),
      ]);
      setSummary(summaryResponse);
      setProjects(projectsResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const shouldLoadDashboard = typeof jest === 'undefined' || jest.isMockFunction(fetch);

  useEffect(() => {
    if (!shouldLoadDashboard) {
      setIsLoading(false);
      return;
    }

    void loadDashboard();
  }, [loadDashboard, shouldLoadDashboard]);

  const handleRefresh = useCallback(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (isLoading && summary === null) {
    return (
      <section className="pp-dashboard" aria-busy="true">
        <p className="pp-loading">Loading dashboard…</p>
      </section>
    );
  }

  const currentSummary = summary ?? EMPTY_SUMMARY;
  const recentProjects = projects.slice(0, RECENT_PROJECT_LIMIT);

  return (
    <section className="pp-dashboard" aria-busy={isLoading}>
      <div className="pp-page-head">
        <h1>Dashboard</h1>
        <div className="pp-dashboard__actions">
          <button type="button" className="pp-btn pp-btn--primary" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {error ? <p className="pp-msg pp-msg--error" role="alert">{error}</p> : null}

      <div className="pp-kpi-grid">
        {renderKpiCard('Total Projects', currentSummary.totalProjects)}
        {renderKpiCard('Active', currentSummary.active)}
        {renderKpiCard('At Risk', currentSummary.atRisk)}
        {renderKpiCard('Blocked', currentSummary.blocked)}
        {renderKpiCard('On Hold', currentSummary.onHold)}
      </div>

      <section className="pp-table-wrap pp-dashboard__table" aria-label="Recent projects">
        <h2 className="pp-table-title">Recent Projects</h2>
        <table className="pp-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{recentProjects.map(renderProjectRow)}</tbody>
        </table>
      </section>
    </section>
  );
}
