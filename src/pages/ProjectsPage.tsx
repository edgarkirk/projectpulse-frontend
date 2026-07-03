import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';

import { createProject, fetchProjects } from '../api';
import { Button } from '../components/Button';
import { DataTable, type DataTableColumn } from '../components/DataTable';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { StatusTag } from '../components/StatusTag';
import type { CreateProjectRequest, ProjectResponse, ProjectStatus } from '../types';

interface ProjectRow extends Record<string, ReactNode> {
  id: string;
  name: string;
  ownerName: string;
  status: ReactNode;
}

const statusOptions: Array<{ label: ProjectStatus; value: ProjectStatus }> = [
  { label: 'Active', value: 'Active' },
  { label: 'At Risk', value: 'At Risk' },
  { label: 'Blocked', value: 'Blocked' },
  { label: 'On Hold', value: 'On Hold' },
];

const projectColumns: Array<DataTableColumn<ProjectRow>> = [
  { key: 'name', header: 'Name' },
  { key: 'ownerName', header: 'Owner' },
  { key: 'status', header: 'Status' },
];

const byNewestFirst = (left: ProjectResponse, right: ProjectResponse): number => {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string' && error.length > 0) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const messageDescriptor = Object.getOwnPropertyDescriptor(error, 'message');
    if (typeof messageDescriptor?.value === 'string' && messageDescriptor.value.length > 0) {
      return messageDescriptor.value;
    }
  }

  return 'Failed to create project';
};

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadProjects = async (): Promise<void> => {
      try {
        const response = await fetchProjects();
        if (!isActive) {
          return;
        }

        setProjects(response);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort(byNewestFirst);
  }, [projects]);

  const projectRows = useMemo<ProjectRow[]>(() => {
    return sortedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      ownerName: project.ownerName,
      status: <StatusTag status={project.status} />,
    }));
  }, [sortedProjects]);

  const clearMessages = (): void => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleNameChange = (value: string): void => {
    clearMessages();
    setName(value);
  };

  const handleOwnerNameChange = (value: string): void => {
    clearMessages();
    setOwnerName(value);
  };

  const handleStatusChange = (value: string): void => {
    clearMessages();

    if (value === 'Active' || value === 'At Risk' || value === 'Blocked' || value === 'On Hold') {
      setStatus(value);
    }
  };

  const refreshProjects = async (): Promise<void> => {
    const response = await fetchProjects();
    setProjects(response);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    clearMessages();

    try {
      const request: CreateProjectRequest = {
        name,
        ownerName,
        status,
      };

      const createdProject = await createProject(request);
      await refreshProjects();
      setName('');
      setOwnerName('');
      setStatus('Active');
      setSuccessMessage(`Project '${createdProject.name}' created successfully.`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main aria-busy="true">
        <p role="status" aria-live="polite">
          Loading projects...
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Projects</h1>
      <section aria-label="Create project form">
        <form onSubmit={handleSubmit}>
          <Input
            id="project-name"
            label="Project Name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter a project name"
          />
          <Input
            id="owner-name"
            label="Owner Name"
            value={ownerName}
            onChange={handleOwnerNameChange}
            placeholder="Enter the owner name"
          />
          <Select
            id="project-status"
            label="Status"
            value={status}
            options={statusOptions}
            onChange={handleStatusChange}
            ariaLabel="Project status"
          />
          <Button type="submit" disabled={isSubmitting}>
            Create project
          </Button>
        </form>
        {errorMessage ? <div role="alert">{errorMessage}</div> : null}
        {successMessage ? <div role="status">{successMessage}</div> : null}
      </section>
      <section>
        <h2>Project List</h2>
        <DataTable<ProjectRow>
          ariaLabel="Projects"
          columns={projectColumns}
          rows={projectRows}
          emptyMessage="No projects yet."
          getRowKey={(row) => row.id}
        />
      </section>
    </main>
  );
};
