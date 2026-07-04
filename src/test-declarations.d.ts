import type { ReactNode } from 'react';

declare module './api' {
  export type ProjectStatus = 'Active' | 'At Risk' | 'Blocked' | 'On Hold';

  export interface CreateProjectRequest {
    name: string;
    ownerName: string;
    status: ProjectStatus;
  }

  export interface ProjectResponse {
    id: string;
    name: string;
    ownerName: string;
    status: ProjectStatus;
    createdAt: string;
  }

  export interface DashboardSummary {
    totalProjects: number;
    active: number;
    atRisk: number;
    blocked: number;
    onHold: number;
  }

  export interface ErrorResponse {
    message: string;
  }

  export const fetchProjects: () => Promise<ProjectResponse[]>;
  export const fetchProjectById: (id: string) => Promise<ProjectResponse>;
  export const fetchDashboardSummary: () => Promise<DashboardSummary>;
  export const createProject: (request: CreateProjectRequest) => Promise<ProjectResponse>;
}

declare module './components/Button' {
  export interface ButtonProps {
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    'aria-label'?: string;
  }

  export const Button: (props: ButtonProps) => JSX.Element;
}

declare module './components/Input' {
  export interface InputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name?: string;
    required?: boolean;
  }

  export const Input: (props: InputProps) => JSX.Element;
}

declare module './components/Select' {
  export interface SelectOption {
    value: string;
    label: string;
  }

  export interface SelectProps {
    id: string;
    label: string;
    value: string;
    options: ReadonlyArray<SelectOption>;
    onChange: (value: string) => void;
  }

  export const Select: (props: SelectProps) => JSX.Element;
}

declare module './components/StatusTag' {
  export interface StatusTagProps {
    status: string;
  }

  export const StatusTag: (props: StatusTagProps) => JSX.Element;
}

declare module './components/KpiCard' {
  export interface KpiCardProps {
    label: string;
    value: number;
  }

  export const KpiCard: (props: KpiCardProps) => JSX.Element;
}

declare module './components/TopBar' {
  export interface TopBarProps {
    title?: string;
  }

  export const TopBar: (props: TopBarProps) => JSX.Element;
}

declare module './components/Sidebar' {
  export interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
  }

  export const Sidebar: (props: SidebarProps) => JSX.Element;
}

declare module './components/DataTable' {
  export interface DataTableProps {
    title: string;
    headers: ReadonlyArray<string>;
    children?: ReactNode;
  }

  export const DataTable: (props: DataTableProps) => JSX.Element;
}

declare module './components/FormMessage' {
  export interface FormMessageProps {
    variant: 'success' | 'error';
    message: string;
  }

  export const FormMessage: (props: FormMessageProps) => JSX.Element;
}

declare module './pages/DashboardPage' {
  export const DashboardPage: () => JSX.Element;
}

declare module './pages/ProjectsPage' {
  export const ProjectsPage: () => JSX.Element;
}

declare module './App' {
  export const App: () => JSX.Element;
}

export {};
