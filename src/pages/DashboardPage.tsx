import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { StatusTag } from '../components/StatusTag';
import type { DashboardSummary, ProjectResponse } from '../types';
import './DashboardPage.css';

interface DashboardPageProps {
  summary: DashboardSummary;
  projects: ProjectResponse[];
}

export const DashboardPage = ({ summary, projects = [] }: DashboardPageProps): JSX.Element => {
  const recentProjects = projects.slice(0, 5);

  return (
    <>
      <div className="pp-page-head">
        <h1>Dashboard</h1>
      </div>

      <div className="pp-kpi-grid">
        <KpiCard label="Total Projects" value={summary.totalProjects} />
        <KpiCard label="Active" value={summary.active} />
        <KpiCard label="At Risk" value={summary.atRisk} />
        <KpiCard label="Blocked" value={summary.blocked} />
        <KpiCard label="On Hold" value={summary.onHold} />
      </div>

      <DataTable title="Recent Projects" ariaLabel="Recent Projects" headers={['Name', 'Owner', 'Status']}>
        {recentProjects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.ownerName}</td>
            <td>
              <StatusTag status={project.status} />
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
};
