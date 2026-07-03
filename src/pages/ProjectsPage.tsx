import React, { useEffect, useState } from 'react';

import { createProject, getProjects } from '../api';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import type { CreateProjectRequest, ProjectResponse, ProjectStatus } from '../types';

const PROJECT_STATUS_OPTIONS: ReadonlyArray<{ label: ProjectStatus; value: ProjectStatus }> = [
  { label: 'Active', value: 'Active' },
  { label: 'At Risk', value: 'At Risk' },
  { label: 'Blocked', value: 'Blocked' },
  { label: 'On Hold', value: 'On Hold' },
];

const INITIAL_FORM_STATE: CreateProjectRequest = {
  name: '',
  ownerName: '',
  status: 'Active',
};

function isProjectStatus(value: string): value is ProjectStatus {
  return PROJECT_STATUS_OPTIONS.some((option) => option.value === value);
}

export function ProjectsPage(): JSX.Element {
  const [formState, setFormState] = useState<CreateProjectRequest>(INITIAL_FORM_STATE);
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProjects(): Promise<void> {
    const latestProjects = await getProjects();
    setProjects(latestProjects);
  }

  useEffect(() => {
    let isActive = true;

    async function fetchProjects(): Promise<void> {
      try {
        const latestProjects = await getProjects();

        if (!isActive) {
          return;
        }

        setProjects(latestProjects);
        setErrorMessage(null);
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setErrorMessage(caughtError instanceof Error ? caughtError.message : 'Failed to load projects.');
      }
    }

    void fetchProjects();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      const createdProject = await createProject(formState);
      await loadProjects();
      setSuccessMessage(`Project '${createdProject.name}' created successfully`);
      setErrorMessage(null);
      setFormState(INITIAL_FORM_STATE);
    } catch (caughtError) {
      setSuccessMessage(null);
      setErrorMessage(caughtError instanceof Error ? caughtError.message : 'Failed to create project.');
    }
  };

  return (
    <main>
      <h2>Projects</h2>
      <form onSubmit={handleSubmit}>
        <Input
          id="project-name"
          label="Project name"
          value={formState.name}
          onChange={(name) => setFormState((current) => ({ ...current, name }))}
        />
        <Input
          id="owner-name"
          label="Owner name"
          value={formState.ownerName}
          onChange={(ownerName) => setFormState((current) => ({ ...current, ownerName }))}
        />
        <Select
          id="project-status"
          label="Status"
          value={formState.status}
          options={PROJECT_STATUS_OPTIONS}
          onChange={(status) => {
            if (isProjectStatus(status)) {
              setFormState((current) => ({ ...current, status }));
            }
          }}
        />
        <Button type="submit">Create project</Button>
      </form>
      {successMessage ? <p role="status">{successMessage}</p> : null}
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      <section aria-label="Projects table">
        <DataTable
          caption="Projects"
          columns={['Name', 'Owner', 'Status']}
          rows={projects}
          emptyMessage="No projects yet."
        />
      </section>
    </main>
  );
}
