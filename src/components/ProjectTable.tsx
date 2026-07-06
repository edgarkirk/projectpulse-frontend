import './ProjectTable.css';
import type { ProjectResponse } from '../types';
import { StatusTag } from './StatusTag';

export interface ProjectTableProps {
  projects: ProjectResponse[];
}

export const ProjectTable = ({ projects }: ProjectTableProps) => {
  if (projects.length === 0) {
    return <p className="pp-table__empty">No projects found</p>;
  }

  return (
    <table className="pp-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.ownerName}</td>
            <td>
              <StatusTag status={project.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
