import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
}

export const StatusTag = ({ status }: StatusTagProps) => {
  return <span>{status}</span>;
};
