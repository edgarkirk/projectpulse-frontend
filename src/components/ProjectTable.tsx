import './ProjectTable.css';
import { StatusTag } from './StatusTag';
import type { ProjectResponse } from '../types';

export interface ProjectTableProps {
  title?: string;
  projects: ProjectResponse[];
  emptyMessage: string;
  compactStatus?: boolean;
}

export const ProjectTable = ({ title, projects, emptyMessage, compactStatus = false }: ProjectTableProps) => {
  return (
    <section className="pp-table-wrap">
      {title ? <h2 className="pp-table-title">{title}</h2> : null}

      {projects.length === 0 ? (
        <p className="pp-table__empty">{emptyMessage}</p>
      ) : (
        <table className="pp-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.ownerName}</td>
                <td>
                  <StatusTag status={project.status} compact={compactStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
