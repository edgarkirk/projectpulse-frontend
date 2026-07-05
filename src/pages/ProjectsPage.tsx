import { useCallback, useLayoutEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { createProject, getProjects } from '../api';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { FormMessage } from '../components/FormMessage';
import { Input } from '../components/Input';
import { Select, type SelectOption } from '../components/Select';
import { StatusTag } from '../components/StatusTag';
import type { CreateProjectRequest, ProjectResponse, ProjectStatus } from '../types';
import './ProjectsPage.css';

const projectStatuses: ReadonlyArray<ProjectStatus> = ['Active', 'At Risk', 'Blocked', 'On Hold'];

const statusOptions: ReadonlyArray<SelectOption> = projectStatuses.map((status) => ({
  label: status,
  value: status,
}));

function isProjectStatus(value: string): value is ProjectStatus {
  return projectStatuses.some((status) => status === value);
}

export function ProjectsPage(): JSX.Element {
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageVariant, setMessageVariant] = useState<'error' | 'success'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    const loadProjects = async (): Promise<void> => {
      try {
        const projectList = await getProjects();
        if (isMounted) {
          setProjects(Array.isArray(projectList) ? projectList : []);
        }
      } catch {
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  }, []);

  const handleOwnerNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setOwnerName(event.currentTarget.value);
  }, []);

  const handleStatusChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.currentTarget.value);
  }, []);

  const rows = useMemo(
    () =>
      projects.map((project) => ({
        key: project.id,
        cells: [project.name, project.ownerName, <StatusTag key={project.id} status={project.status} />],
      })),
    [projects]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setMessage(null);

      if (!isProjectStatus(status)) {
        setMessage(status ? 'Status must be one of Active, At Risk, Blocked, On Hold' : 'Status is required');
        setMessageVariant('error');
        return;
      }

      setIsSubmitting(true);

      const request: CreateProjectRequest = {
        name: name.trim(),
        ownerName: ownerName.trim(),
        status,
      };

      try {
        const createdProject = await createProject(request);
        setProjects((currentProjects) => [createdProject, ...currentProjects]);
        setName('');
        setOwnerName('');
        setStatus('');
        setMessage('Project created');
        setMessageVariant('success');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        setMessageVariant('error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, ownerName, status]
  );

  return (
    <section aria-labelledby="projects-title">
      <div className="pp-page-head">
        <h1 id="projects-title">Projects</h1>
      </div>
      {isLoaded ? (
        <>
          <div className="pp-form-wrap">
            <h3 className="pp-form-title">Create Project</h3>
            <FormMessage message={message} variant={messageVariant} />
            <form className="pp-form" onSubmit={handleSubmit}>
              <Input
                label="Project Name"
                maxLength={100}
                name="name"
                onChange={handleNameChange}
                placeholder="Enter project name"
                required
                value={name}
              />
              <Input
                label="Owner Name"
                maxLength={100}
                name="ownerName"
                onChange={handleOwnerNameChange}
                placeholder="Enter owner name"
                required
                value={ownerName}
              />
              <Select
                label="Status"
                name="status"
                onChange={handleStatusChange}
                options={statusOptions}
                placeholder="Select status..."
                required
                value={status}
              />
              <Button disabled={isSubmitting} type="submit">
                Create Project
              </Button>
            </form>
          </div>
          <DataTable
            caption="All Projects"
            columns={[
              { header: 'Name' },
              { header: 'Owner' },
              { header: 'Status' },
            ]}
            rows={rows}
          />
        </>
      ) : null}
    </section>
  );
}
