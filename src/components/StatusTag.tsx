import './StatusTag.css';

import type { ProjectStatus } from '../types/project';

export interface StatusTagProps {
  status: ProjectStatus;
}

type StatusTone = 'success' | 'warning' | 'error' | 'info';

const statusToneMap: Record<ProjectStatus, StatusTone> = {
  Active: 'success',
  'At Risk': 'warning',
  Blocked: 'error',
  'On Hold': 'info',
};

export const StatusTag = ({ status }: StatusTagProps) => {
  const tone = statusToneMap[status];

  return (
    <span className={`pp-tag pp-tag--${tone}`} role='status' aria-label={`Status: ${status}`} data-tone={tone}>
      {status}
    </span>
  );
};
