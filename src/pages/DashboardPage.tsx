import { useEffect, useState } from 'react';

import './DashboardPage.css';

import { fetchDashboardSummary, fetchProjects } from '../api';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { StatusTag } from '../components/StatusTag';
import type { DashboardSummary, ProjectResponse } from '../types/project';
import type { ReactNode } from 'react';

const defaultSummary: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

export const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async (): Promise<void> => {
      try {
        const [summaryData, projectsData] = await Promise.all([fetchDashboardSummary(), fetchProjects()]);

        if (!isMounted) {
          return;
        }

        setSummary(summaryData);
        setProjects(projectsData);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        setError(caughtError instanceof Error ? caughtError.message : 'Failed to load dashboard data');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role='alert'>{error}</p>;
  }

  const currentSummary = summary ?? defaultSummary;
  const recentProjects = projects.slice(0, 5);
  const rows: ReactNode[][] = recentProjects.map((project) => [
    project.name,
    project.ownerName,
    <StatusTag key={project.id} status={project.status} />,
  ]);

  return (
    <section>
      <header className='pp-page-head'>
        <h1>Dashboard</h1>
      </header>

      <div className='pp-kpi-grid'>
        <KpiCard label='Total Projects' value={currentSummary.totalProjects} />
        <KpiCard label='Active' value={currentSummary.active} />
        <KpiCard label='At Risk' value={currentSummary.atRisk} />
        <KpiCard label='Blocked' value={currentSummary.blocked} />
        <KpiCard label='On Hold' value={currentSummary.onHold} />
      </div>

      <div>
        <h3 className='pp-table-title'>Recent Projects</h3>
        <DataTable headers={['Name', 'Owner', 'Status']} rows={rows} emptyMessage='No recent projects found' />
      </div>
    </section>
  );
};
