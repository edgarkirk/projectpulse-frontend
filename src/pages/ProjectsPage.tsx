import { type FormEvent, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { FormMessage } from '../components/FormMessage';
import { StatusTag } from '../components/StatusTag';
import type { CreateProjectRequest, ProjectResponse, ProjectStatus } from '../types';
import './ProjectsPage.css';

interface ProjectsPageProps {
  projects: ProjectResponse[];
  onCreateProject: (request: CreateProjectRequest) => Promise<ProjectResponse>;
  onProjectCreated: (project: ProjectResponse) => void;
}

interface FormFeedback {
  kind: 'success' | 'error';
  message: string;
}

const STATUS_OPTIONS: ProjectStatus[] = ['Active', 'At Risk', 'Blocked', 'On Hold'];

export const ProjectsPage = ({ projects = [], onCreateProject, onProjectCreated }: ProjectsPageProps): JSX.Element => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFeedback(null);

    try {
      const createdProject = await onCreateProject({
        name: name.trim(),
        ownerName: ownerName.trim(),
        status: status as ProjectStatus,
      });

      onProjectCreated(createdProject);
      setName('');
      setOwnerName('');
      setStatus('');
      setFeedback({ kind: 'success', message: `Project ${createdProject.name} created successfully.` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFeedback({ kind: 'error', message });
    }
  };

  return (
    <>
      <div className="pp-page-head">
        <h1>Projects</h1>
      </div>

      <section className="pp-form-wrap" aria-labelledby="create-project-heading">
        <h3 id="create-project-heading" className="pp-form-title">
          Create Project
        </h3>

        {feedback !== null ? <FormMessage kind={feedback.kind} message={feedback.message} /> : null}

        <form className="pp-form" onSubmit={handleSubmit}>
          <div className="pp-field">
            <label className="pp-field__label" htmlFor="project-name">
              Project Name
            </label>
            <input
              id="project-name"
              className="pp-input"
              type="text"
              value={name}
              maxLength={100}
              placeholder="Enter project name"
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="pp-field">
            <label className="pp-field__label" htmlFor="owner-name">
              Owner Name
            </label>
            <input
              id="owner-name"
              className="pp-input"
              type="text"
              value={ownerName}
              maxLength={100}
              placeholder="Enter owner name"
              onChange={(event) => setOwnerName(event.target.value)}
            />
          </div>

          <div className="pp-field">
            <label className="pp-field__label" htmlFor="project-status">
              Status
            </label>
            <select
              id="project-status"
              className="pp-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Select status...</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="pp-btn pp-btn--primary">
            Create Project
          </button>
        </form>
      </section>

      <DataTable title="All Projects" ariaLabel="Projects" headers={['Name', 'Owner', 'Status']}>
        {projects.map((project) => (
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
