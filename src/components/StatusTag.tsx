import React from 'react';
import type { ProjectStatus } from '../api';
import './StatusTag.css';

export interface StatusTagProps {
  status: ProjectStatus | string;
}

const statusClassMap: Record<string, string> = {
  Active: 'pp-tag--success',
  'At Risk': 'pp-tag--warning',
  Blocked: 'pp-tag--error',
  'On Hold': 'pp-tag--info',
};

export function StatusTag({ status }: StatusTagProps): JSX.Element {
  const statusClass = statusClassMap[status] ?? 'pp-tag--neutral';

  return (
    <span className={`pp-tag ${statusClass}`} aria-label={`Status: ${status}`}>
      {status}
    </span>
  );
}
