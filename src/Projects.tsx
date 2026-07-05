import { useEffect, useState } from 'react';
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
    <main>
      <h1>Projects</h1>
      {error ? <p role="alert">{error}</p> : null}
      <CreateProjectForm onSubmit={handleCreateProject} />
      <ProjectList projects={projects} />
    </main>
  );
}
