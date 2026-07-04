import React, { useEffect, useState } from 'react';
import './ProjectsPage.css';
import { createProject, fetchProjects, type CreateProjectRequest, type ProjectResponse, type ProjectStatus } from '../api';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { FormMessage } from '../components/FormMessage';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { StatusTag } from '../components/StatusTag';

const statusOptions: ReadonlyArray<{ value: ProjectStatus; label: ProjectStatus }> = [
  { value: 'Active', label: 'Active' },
  { value: 'At Risk', label: 'At Risk' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'On Hold', label: 'On Hold' },
];

function isProjectStatus(value: string): value is ProjectStatus {
  return value === 'Active' || value === 'At Risk' || value === 'Blocked' || value === 'On Hold';
}

const emptyForm: CreateProjectRequest = {
  name: '',
  ownerName: '',
  status: 'Active',
};

const headers = ['Name', 'Owner', 'Status'];

function ProjectRows({ projects }: { projects: ReadonlyArray<ProjectResponse> }): JSX.Element {
  return (
    <>
      {projects.map((project) => (
        <tr key={project.id}>
          <td>{project.name}</td>
          <td>{project.ownerName}</td>
          <td><StatusTag status={project.status} /></td>
        </tr>
      ))}
    </>
  );
}

export function ProjectsPage(): JSX.Element {
  const [form, setForm] = useState<CreateProjectRequest>(emptyForm);
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects(): Promise<void> {
      try {
        const response = await fetchProjects();

        if (!isMounted) {
          return;
        }

        setProjects(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load projects');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const createdProject = await createProject(form);
      setProjects((currentProjects) => [createdProject, ...currentProjects]);
      setSuccessMessage('Project created successfully');
      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create project');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="pp-page">
      <section className="pp-page__intro">
        <h1>Projects</h1>
        <p>Create a project and review the full project list.</p>
      </section>

      <section className="pp-panel" aria-label="Create project form panel">
        <form aria-label="Create project form" onSubmit={(event) => { void handleSubmit(event); }}>
          <Input
            id="project-name"
            label="Project Name"
            value={form.name}
            onChange={(value) => setForm((currentForm) => ({ ...currentForm, name: value }))}
            placeholder="Atlas Migration"
            name="name"
          />
          <Input
            id="owner-name"
            label="Owner Name"
            value={form.ownerName}
            onChange={(value) => setForm((currentForm) => ({ ...currentForm, ownerName: value }))}
            placeholder="Jane Doe"
            name="ownerName"
          />
          <Select
            id="status"
            label="Status"
            value={form.status}
            options={statusOptions}
            onChange={(value) => {
              if (isProjectStatus(value)) {
                setForm((currentForm) => ({ ...currentForm, status: value }));
              }
            }}
          />
          <Button type="submit" disabled={isSubmitting}>
            Create Project
          </Button>
        </form>

        {successMessage.length > 0 ? <FormMessage variant="success" message={successMessage} /> : null}
        {errorMessage.length > 0 ? <FormMessage variant="error" message={errorMessage} /> : null}
      </section>

      <DataTable title="Projects list" headers={headers}>
        {isLoading ? null : <ProjectRows projects={projects} />}
      </DataTable>
    </main>
  );
}
