import React, { useEffect, useState } from 'react';

import { getDashboardSummary, getProjects } from '../api';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import type { DashboardSummary, ProjectResponse } from '../types';

const INITIAL_SUMMARY: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

export function DashboardPage(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummary>(INITIAL_SUMMARY);
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard(): Promise<void> {
      try {
        const [summaryResult, projectsResult] = await Promise.all([getDashboardSummary(), getProjects()]);

        if (!isActive) {
          return;
        }

        setSummary(summaryResult);
        setProjects(projectsResult);
        setError(null);
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(caughtError instanceof Error ? caughtError.message : 'Failed to load dashboard.');
      }
    }

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const recentProjects = projects.slice(0, 5);

  return (
    <main>
      <h2>Dashboard</h2>
      {error ? <p role="alert">{error}</p> : null}
      <section aria-label="Dashboard KPIs">
        <KpiCard label="Total Projects" value={summary.totalProjects} />
        <KpiCard label="Active" value={summary.active} />
        <KpiCard label="At Risk" value={summary.atRisk} />
        <KpiCard label="Blocked" value={summary.blocked} />
        <KpiCard label="On Hold" value={summary.onHold} />
      </section>
      <section aria-label="Recent projects">
        <DataTable
          caption="Recent projects"
          columns={['Name', 'Owner', 'Status']}
          rows={recentProjects}
          emptyMessage="No recent projects yet."
        />
      </section>
    </main>
  );
}
