import './StatusTag.css';

import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
}

const statusClassNames: Record<ProjectStatus, string> = {
  Active: 'status-tag status-tag--success',
  'At Risk': 'status-tag status-tag--warning',
  Blocked: 'status-tag status-tag--error',
  'On Hold': 'status-tag status-tag--info',
};

export const StatusTag = ({ status }: StatusTagProps) => {
  return (
    <span className={statusClassNames[status]} aria-label={`Status: ${status}`}>
      {status}
    </span>
  );
};
