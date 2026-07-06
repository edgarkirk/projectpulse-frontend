import './ProjectsPage.css';
import { useEffect, useState } from 'react';
import { createProject, fetchProjects } from '../api';
import { DataTable } from '../components/DataTable';
import { FormMessage } from '../components/FormMessage';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectTable } from '../components/ProjectTable';
import type { CreateProjectRequest, ProjectResponse } from '../types';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const projectData = await fetchProjects();
        if (!isMounted) {
          return;
        }

        setProjects(projectData);
        setError(null);
      } catch (errorValue) {
        if (!isMounted) {
          return;
        }

        setError(errorValue instanceof Error ? errorValue.message : 'Failed to load projects');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProject = async (request: CreateProjectRequest) => {
    setSuccessMessage(null);
    setError(null);

    try {
      const createdProject = await createProject(request);
      setProjects((currentProjects) => [
        createdProject,
        ...currentProjects.filter((project) => project.id !== createdProject.id),
      ]);
      setSuccessMessage('Project created successfully');
    } catch (errorValue) {
      const message = errorValue instanceof Error ? errorValue.message : 'Failed to create project';
      setError(message);
      throw errorValue instanceof Error ? errorValue : new Error(message);
    }
  };

  return (
    <section className="pp-projects">
      <div className="pp-page-head">
        <h1>Projects</h1>
      </div>

      <section className="pp-form-wrap" aria-label="Create Project">
        <h3 className="pp-form-title">Create Project</h3>
        {successMessage ? <FormMessage message={successMessage} tone="success" /> : null}
        <ProjectForm onSubmit={handleCreateProject} />
      </section>

      <div className="pp-projects__table-section">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <FormMessage message={error} tone="error" />
        ) : (
          <DataTable title="All Projects">
            <ProjectTable projects={projects} />
          </DataTable>
        )}
      </div>
    </section>
  );
};
