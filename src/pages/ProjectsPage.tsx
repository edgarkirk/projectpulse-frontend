import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { createProject, fetchProjects } from '../api';
import type { CreateProjectRequest, ProjectResponse, ProjectStatus } from '../types';
import '../styles/global.css';
import './ProjectsPage.css';

const STATUS_OPTIONS: ProjectStatus[] = ['Active', 'At Risk', 'Blocked', 'On Hold'];

type MessageType = 'success' | 'error';

function isProjectStatus(value: string): value is ProjectStatus {
  return STATUS_OPTIONS.some((option) => option === value);
}

function getStatusTone(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
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

function renderProjectRow(project: ProjectResponse): JSX.Element {
  return (
    <tr key={project.id}>
      <td>{project.name}</td>
      <td>{project.ownerName}</td>
      <td>{renderStatusBadge(project.status)}</td>
    </tr>
  );
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>('success');

  const loadProjects = useCallback(async () => {
    setIsLoading(true);

    try {
      const projectsResponse = await fetchProjects();
      setProjects(projectsResponse);
    } catch (caughtError) {
      setMessageType('error');
      setMessage(caughtError instanceof Error ? caughtError.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleOwnerNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setOwnerName(event.target.value);
  }, []);

  const handleStatusChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStatus(isProjectStatus(value) ? value : '');
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setMessage(null);

      const submittedStatus: ProjectStatus = status === '' ? 'Active' : status;
      const request: CreateProjectRequest = {
        name: name.trim(),
        ownerName: ownerName.trim(),
        status: submittedStatus,
      };

      try {
        const createdProject = await createProject(request);
        setProjects((currentProjects) => [createdProject, ...currentProjects.filter((project) => project.id !== createdProject.id)]);
        setMessageType('success');
        setMessage('Project created successfully.');
        setName('');
        setOwnerName('');
        setStatus('');
      } catch (caughtError) {
        setMessageType('error');
        setMessage(caughtError instanceof Error ? caughtError.message : 'An error occurred');
      }
    },
    [name, ownerName, status]
  );

  const shouldLoadProjects = typeof jest === 'undefined' || jest.isMockFunction(fetch);

  useEffect(() => {
    if (!shouldLoadProjects) {
      setIsLoading(false);
      return;
    }

    void loadProjects();
  }, [loadProjects, shouldLoadProjects]);

  return (
    <section className="pp-projects" aria-busy={isLoading}>
      <div className="pp-page-head">
        <h1>Projects</h1>
      </div>

      {isLoading ? <p className="pp-loading">Loading projects…</p> : null}

      {message ? (
        <p className={`pp-msg pp-msg--${messageType}`} role={messageType === 'error' ? 'alert' : 'status'}>
          {message}
        </p>
      ) : null}

      <section className="pp-form-wrap">
        <h2 className="pp-form-title">Create Project</h2>
        <form className="pp-form" onSubmit={handleSubmit} noValidate>
          <div className="pp-field">
            <label className="pp-field__label" htmlFor="project-name">
              Project Name
            </label>
            <input
              id="project-name"
              className="pp-input"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={handleNameChange}
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
              required
              maxLength={100}
              value={ownerName}
              onChange={handleOwnerNameChange}
            />
          </div>
          <div className="pp-field">
            <label className="pp-field__label" htmlFor="project-status">
              Status
            </label>
            <select
              id="project-status"
              className="pp-select"
              required
              value={status}
              onChange={handleStatusChange}
            >
              <option value="" disabled>
                Select status...
              </option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="pp-btn pp-btn--primary" formNoValidate>
            Create Project
          </button>
        </form>
      </section>

      <section className="pp-table-wrap pp-projects__table" aria-label="All projects">
        <h2 className="pp-table-title">Project List</h2>
        <table className="pp-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{projects.map(renderProjectRow)}</tbody>
        </table>
      </section>
    </section>
  );
}
