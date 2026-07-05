import type { ProjectStatus } from '../types';

export interface StatusTagProps {
  status: ProjectStatus;
}

export function StatusTag({ status }: StatusTagProps): JSX.Element {
  void status;
  throw new Error('TODO: implement StatusTag');
}
