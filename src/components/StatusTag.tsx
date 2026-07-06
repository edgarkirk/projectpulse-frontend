import './StatusTag.css';
import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
  compact?: boolean;
}

const toneByStatus: Record<ProjectStatus, 'success' | 'warning' | 'error' | 'info'> = {
  Active: 'success',
  'At Risk': 'warning',
  Blocked: 'error',
  'On Hold': 'info',
};

export const StatusTag = ({ status, compact = false }: StatusTagProps) => {
  const tone = toneByStatus[status];
  const className = compact ? `pp-tag pp-tag--${tone} pp-tag--compact` : `pp-tag pp-tag--${tone}`;

  return (
    <span className={className} aria-label={status} data-status-label={status}>
      {compact ? null : status}
    </span>
  );
};
