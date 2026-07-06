import './StatusTag.css';
import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
}

function getStatusModifier(status: ProjectStatus): string {
  return status.toLowerCase().replace(/\s+/g, '-');
}

export const StatusTag = ({ status }: StatusTagProps) => {
  const modifier = getStatusModifier(status);

  return <span className={`pp-tag pp-tag--${modifier}`}>{status}</span>;
};
