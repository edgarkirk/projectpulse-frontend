import { useState, type FormEvent } from 'react';
import './CreateProjectForm.css';
import { CreateProjectRequest, ProjectStatus } from './types';

export interface CreateProjectFormProps {
  onSubmit: (request: CreateProjectRequest) => Promise<void> | void;
}

const projectStatuses: ReadonlyArray<ProjectStatus> = ['Active', 'At Risk', 'Blocked', 'On Hold'];

function isProjectStatus(value: string): value is ProjectStatus {
  return projectStatuses.some((status) => status === value);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}

export function CreateProjectForm({ onSubmit }: CreateProjectFormProps) {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    try {
      await onSubmit({ name, ownerName, status });
      setName('');
      setOwnerName('');
      setStatus('Active');
      setFeedback({ kind: 'success', message: 'Project created successfully' });
    } catch (error) {
      setFeedback({ kind: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <section className="pp-form-wrap">
      <h3 className="pp-form-title">Create Project</h3>
      {feedback ? (
        <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`pp-msg pp-msg--${feedback.kind}`}>
          {feedback.message}
        </p>
      ) : null}
      <form aria-label="create project form" className="pp-form" onSubmit={handleSubmit}>
        <div className="pp-field">
          <label className="pp-field__label" htmlFor="project-name">
            Project Name
          </label>
          <input
            className="pp-input"
            id="project-name"
            name="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="pp-field">
          <label className="pp-field__label" htmlFor="owner-name">
            Owner Name
          </label>
          <input
            className="pp-input"
            id="owner-name"
            name="owner-name"
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="pp-field">
          <label className="pp-field__label" htmlFor="project-status">
            Status
          </label>
          <select
            className="pp-select"
            id="project-status"
            name="project-status"
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value;
              if (isProjectStatus(nextStatus)) {
                setStatus(nextStatus);
              }
            }}
            required
          >
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
            <option value="Blocked">Blocked</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <button className="pp-btn pp-btn--primary" type="submit">
          Create Project
        </button>
      </form>
    </section>
  );
}
