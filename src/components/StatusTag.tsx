import React from 'react';

import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
}

const STATUS_STYLES: Record<ProjectStatus, React.CSSProperties> = {
  Active: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  'At Risk': {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  Blocked: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  'On Hold': {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
};

export function StatusTag({ status }: StatusTagProps): JSX.Element {
  return (
    <span
      aria-label={`Status: ${status}`}
      data-status={status}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        padding: '0.25rem 0.75rem',
        fontWeight: 600,
        ...STATUS_STYLES[status],
      }}
    >
      {status}
    </span>
  );
}
