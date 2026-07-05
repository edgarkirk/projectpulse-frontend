import { useEffect, useState, type FormEvent } from 'react';

import './ProjectsPage.css';

import { createProject, fetchProjects } from '../api';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { Input } from '../components/Input';
import { Select, type SelectOption } from '../components/Select';
import { StatusTag } from '../components/StatusTag';
import type { ProjectResponse, ProjectStatus } from '../types/project';
import type { ReactNode } from 'react';

const statusOptions: SelectOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'At Risk', label: 'At Risk' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'On Hold', label: 'On Hold' },
];

const isProjectStatus = (value: string): value is ProjectStatus => {
  return value === 'Active' || value === 'At Risk' || value === 'Blocked' || value === 'On Hold';
};

type FeedbackState =
  | {
      type: 'success';
      message: string;
    }
  | {
      type: 'error';
      message: string;
    }
  | null;

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async (): Promise<void> => {
      try {
        const data = await fetchProjects();

        if (!isMounted) {
          return;
        }

        setProjects(data);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        setLoadError(caughtError instanceof Error ? caughtError.message : 'Failed to load projects');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (status === '') {
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);

    try {
      const createdProject = await createProject({
        name: name.trim(),
        ownerName: ownerName.trim(),
        status,
      });

      setProjects((currentProjects) => [createdProject, ...currentProjects]);
      setName('');
      setOwnerName('');
      setStatus('');
      setFeedback({
        type: 'success',
        message: `Project "${createdProject.name}" created successfully.`,
      });
    } catch (caughtError) {
      setFeedback({
        type: 'error',
        message: caughtError instanceof Error ? caughtError.message : 'Failed to create project',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (loadError) {
    return <p role='alert'>{loadError}</p>;
  }

  const canSubmit = name.trim().length > 0 && ownerName.trim().length > 0 && status !== '' && !isSubmitting;
  const rows: ReactNode[][] = projects.map((project) => [
    project.name,
    project.ownerName,
    <StatusTag key={project.id} status={project.status} />,
  ]);

  return (
    <section>
      <header className='pp-page-head'>
        <h1>Projects</h1>
      </header>

      <div className='pp-form-wrap'>
        <h3 className='pp-form-title'>Create Project</h3>

        {feedback ? (
          <p
            className={`pp-msg pp-msg--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
            aria-label={feedback.message}
          >
            {feedback.message}
          </p>
        ) : null}

        <form className='pp-form' onSubmit={handleSubmit}>
          <Input
            label='Project Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='Enter project name'
            maxLength={100}
            required
          />
          <Input
            label='Owner Name'
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            placeholder='Enter owner name'
            maxLength={100}
            required
          />
          <Select
            label='Status'
            value={status}
            onChange={(event) => setStatus(isProjectStatus(event.target.value) ? event.target.value : '')}
            options={statusOptions}
            required
          />
          <Button type='submit' disabled={!canSubmit}>
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </div>

      <div>
        <h3 className='pp-table-title'>All Projects</h3>
        <DataTable headers={['Name', 'Owner', 'Status']} rows={rows} emptyMessage='No projects found' />
      </div>
    </section>
  );
};
