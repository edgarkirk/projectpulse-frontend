import './ProjectList.css';
import { ProjectResponse, ProjectStatus } from './types';

export interface ProjectListProps {
  projects: ReadonlyArray<ProjectResponse>;
}

const statusClassNames: Record<ProjectStatus, string> = {
  Active: 'pp-tag--success',
  'At Risk': 'pp-tag--warning',
  Blocked: 'pp-tag--error',
  'On Hold': 'pp-tag--info',
};

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <p className="pp-empty-state">No projects found</p>;
  }

  return (
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
              <span className={`pp-tag ${statusClassNames[project.status]}`}>{project.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
