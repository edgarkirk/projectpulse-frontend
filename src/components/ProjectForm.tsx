import './ProjectForm.css';
import { useState } from 'react';
import type { CreateProjectRequest, ProjectStatus } from '../types';

export interface ProjectFormProps {
  onSubmit: (request: CreateProjectRequest) => Promise<void> | void;
}

const isProjectStatus = (value: string): value is ProjectStatus => {
  return value === 'Active' || value === 'At Risk' || value === 'Blocked' || value === 'On Hold';
};

export const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = isSubmitting || !name.trim() || !ownerName.trim() || status === '';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled || status === '') {
      return;
    }

    const trimmedName = name.trim();
    const trimmedOwnerName = ownerName.trim();

    if (!trimmedName || !trimmedOwnerName) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: trimmedName,
        ownerName: trimmedOwnerName,
        status,
      });
      setName('');
      setOwnerName('');
      setStatus('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value;
    setStatus(isProjectStatus(nextStatus) ? nextStatus : '');
  };

  return (
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
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div className="pp-field">
        <label className="pp-field__label" htmlFor="project-owner-name">
          Owner Name
        </label>
        <input
          id="project-owner-name"
          className="pp-input"
          type="text"
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
          id="project-status"
          className="pp-select"
          value={status}
          onChange={handleStatusChange}
          required
        >
          <option value="" disabled>
            Select status...
          </option>
          <option value="Active">Active</option>
          <option value="At Risk">At Risk</option>
          <option value="Blocked">Blocked</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {errorMessage ? (
        <p className="pp-form__error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button className="pp-btn pp-btn--primary" type="submit" disabled={isSubmitDisabled}>
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};
