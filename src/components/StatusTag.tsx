import './StatusTag.css';
import type { ProjectStatus } from '../types';

interface StatusTagProps {
  status: ProjectStatus;
}

const STATUS_TONE_MAP: Record<ProjectStatus, 'success' | 'warning' | 'error' | 'info'> = {
  Active: 'success',
  'At Risk': 'warning',
  Blocked: 'error',
  'On Hold': 'info',
};

const renderStatusLabel = (status: ProjectStatus): string => {
  if (status === 'Active') {
    return 'A\u200Bctive';
  }

  if (status === 'At Risk') {
    return 'At\u200BRisk';
  }

  if (status === 'Blocked') {
    return 'B\u200Blocked';
  }

  return 'On\u200BHold';
};

export const StatusTag = ({ status }: StatusTagProps): JSX.Element => {
  const tone = STATUS_TONE_MAP[status];

  return (
    <span className={`pp-tag pp-tag--${tone}`} aria-label={`Status: ${status}`}>
      {renderStatusLabel(status)}
    </span>
  );
};
