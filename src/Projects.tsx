import { useEffect, useState } from 'react';
import './Projects.css';
import { createProject, fetchProjects } from './api';
import { CreateProjectForm } from './CreateProjectForm';
import { ProjectList } from './ProjectList';
import { CreateProjectRequest, ProjectResponse } from './types';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load projects';
}

export function Projects() {
  const [projects, setProjects] = useState<ReadonlyArray<ProjectResponse>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const nextProjects = await fetchProjects();
        if (isMounted) {
          setProjects(nextProjects);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError));
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProject = async (request: CreateProjectRequest) => {
    const createdProject = await createProject(request);
    setProjects((currentProjects) => [createdProject, ...currentProjects]);
  };

  return (
    <section className="pp-projects">
      <div className="pp-page-head">
        <h1>Projects</h1>
      </div>
      {error ? (
        <p role="alert" className="pp-msg pp-msg--error pp-projects__error">
          {error}
        </p>
      ) : null}
      <CreateProjectForm onSubmit={handleCreateProject} />
      <section aria-label="all projects" className="pp-table-wrap">
        <h3 className="pp-table-title">All Projects</h3>
        <ProjectList projects={projects} />
      </section>
    </section>
  );
}
