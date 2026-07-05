import { ProjectResponse, ProjectStatus } from './types';

export interface ProjectListProps {
  projects: ReadonlyArray<ProjectResponse>;
}

const statusStyles: Record<ProjectStatus, { backgroundColor: string; color: string }> = {
  Active: { backgroundColor: '#166534', color: '#ffffff' },
  'At Risk': { backgroundColor: '#92400e', color: '#ffffff' },
  Blocked: { backgroundColor: '#b91c1c', color: '#ffffff' },
  'On Hold': { backgroundColor: '#0e7490', color: '#ffffff' },
};

function formatCreatedAt(createdAt: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt));
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <p>No projects found</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Project Name</th>
          <th scope="col">Owner Name</th>
          <th scope="col">Status</th>
          <th scope="col">Created At</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.ownerName}</td>
            <td>
              <span
                style={{
                  backgroundColor: statusStyles[project.status].backgroundColor,
                  color: statusStyles[project.status].color,
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  fontWeight: 600,
                  padding: '0.25rem 0.75rem',
                }}
              >
                {project.status}
              </span>
            </td>
            <td>{formatCreatedAt(project.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
