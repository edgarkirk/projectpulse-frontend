import type { CreateProjectRequest } from '../types';

export interface ProjectFormProps {
  onSubmit: (request: CreateProjectRequest) => Promise<void> | void;
}

export function ProjectForm(_props: ProjectFormProps): null {
  return null;
}
