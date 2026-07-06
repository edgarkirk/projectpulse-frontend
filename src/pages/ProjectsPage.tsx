import { useEffect, useState } from 'react';
import './ProjectsPage.css';
import { createProject, fetchProjects } from '../api';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectTable } from '../components/ProjectTable';
import type { CreateProjectRequest, ProjectResponse } from '../types';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectData = await fetchProjects();
        setProjects(projectData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, []);

  const handleCreateProject = async (request: CreateProjectRequest): Promise<void> => {
    const createdProject = await createProject(request);
    setProjects((currentProjects) => [createdProject, ...currentProjects]);
    setStatusMessage(`Project "${createdProject.name}" created successfully.`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  return (
    <section className="pp-projects">
      <div className="pp-page-head">
        <h1>Projects</h1>
      </div>
      {statusMessage ? (
        <p className="pp-msg pp-msg--success" role="status" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}
      <div className="pp-form-wrap">
        <h2 className="pp-form-title">Create Project</h2>
        <ProjectForm onSubmit={handleCreateProject} />
      </div>
      <ProjectTable title="All Projects" projects={projects} emptyMessage="No projects found" compactStatus />
    </section>
  );
};
