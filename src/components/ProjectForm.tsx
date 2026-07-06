import './ProjectForm.css';
import { useState, type FormEvent } from 'react';
import { Button } from './Button';
import { FormMessage } from './FormMessage';
import { Input } from './Input';
import { Select } from './Select';
import type { CreateProjectRequest, ProjectStatus } from '../types';

const statusOptions: ProjectStatus[] = ['Active', 'At Risk', 'Blocked', 'On Hold'];

function isProjectStatus(value: string): value is ProjectStatus {
  return (
    value === 'Active' ||
    value === 'At Risk' ||
    value === 'Blocked' ||
    value === 'On Hold'
  );
}

export interface ProjectFormProps {
  onSubmit: (request: CreateProjectRequest) => Promise<void>;
}

export const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = isSubmitting || !name.trim() || !ownerName.trim() || !status;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisabled) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        ownerName: ownerName.trim(),
        status,
      });
      setName('');
      setOwnerName('');
      setStatus('');
    } catch (errorValue) {
      setError(errorValue instanceof Error ? errorValue.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="pp-form" onSubmit={handleSubmit}>
      <Input
        id="project-name"
        label="Project Name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        maxLength={100}
        placeholder="Enter project name"
      />

      <Input
        id="owner-name"
        label="Owner Name"
        type="text"
        value={ownerName}
        onChange={(event) => setOwnerName(event.target.value)}
        required
        maxLength={100}
        placeholder="Enter owner name"
      />

      <Select
        id="project-status"
        label="Status"
        value={status}
        onChange={(event) => {
          const nextStatus = event.currentTarget.value;
          setStatus(isProjectStatus(nextStatus) ? nextStatus : '');
        }}
        required
      >
        <option value="">Select status...</option>
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>

      {error ? <FormMessage message={error} tone="error" /> : null}

      <div className="pp-form__actions">
        <Button type="submit" disabled={isDisabled}>
          Create Project
        </Button>
      </div>
    </form>
  );
};
