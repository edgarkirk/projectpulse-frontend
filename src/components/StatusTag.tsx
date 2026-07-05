import type { ProjectStatus } from '../types';
import './StatusTag.css';

export interface StatusTagProps {
  status: ProjectStatus;
}

const statusTones = {
  Active: 'success',
  'At Risk': 'warning',
  Blocked: 'error',
  'On Hold': 'info',
} as const;

export function StatusTag({ status }: StatusTagProps): JSX.Element {
  const tone = statusTones[status];

  return (
    <span className={`pp-tag pp-tag--${tone}`}>
      {status}
    </span>
  );
}
