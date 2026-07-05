import { useState, type FormEvent } from 'react';
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
    <form aria-label="create project form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          name="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="owner-name">Owner Name</label>
        <input
          id="owner-name"
          name="owner-name"
          value={ownerName}
          onChange={(event) => setOwnerName(event.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="project-status">Status</label>
        <select
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

      <button type="submit">Create Project</button>

      {feedback ? (
        <p role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.message}</p>
      ) : null}
    </form>
  );
}
