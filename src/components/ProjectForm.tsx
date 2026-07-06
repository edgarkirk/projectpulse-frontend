import React from 'react';
import type { CreateProjectRequest } from '../types';

export interface ProjectFormProps {
  onSubmit: (request: CreateProjectRequest) => Promise<void> | void;
}

export function ProjectForm(_props: ProjectFormProps): JSX.Element | null {
  return null;
}
