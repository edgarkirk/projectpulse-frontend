import React from 'react';

import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
}

export function StatusTag({ status }: StatusTagProps): JSX.Element {
  return <span>{status}</span>;
}
