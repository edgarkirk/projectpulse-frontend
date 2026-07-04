import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { createProject, fetchDashboardSummary, fetchProjects } from './api';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import type { CreateProjectRequest, DashboardSummary, ProjectResponse, AppRoute } from './types';
import './App.css';

const DEFAULT_SUMMARY: DashboardSummary = {
  totalProjects: 0,
  active: 0,
  atRisk: 0,
  blocked: 0,
  onHold: 0,
};

const parseRoute = (): AppRoute => {
  const hash = window.location.hash.replace('#', '');
  return hash === '/projects' ? '/projects' : '/dashboard';
};

const buildSummary = (projects: ProjectResponse[]): DashboardSummary => {
  return projects.reduce<DashboardSummary>(
    (summary, project) => {
      summary.totalProjects += 1;

      if (project.status === 'Active') {
        summary.active += 1;
      } else if (project.status === 'At Risk') {
        summary.atRisk += 1;
      } else if (project.status === 'Blocked') {
        summary.blocked += 1;
      } else if (project.status === 'On Hold') {
        summary.onHold += 1;
      }

      return summary;
    },
    { ...DEFAULT_SUMMARY }
  );
};

export const App = (): JSX.Element => {
  const [route, setRoute] = useState<AppRoute>(parseRoute());
  const [summary, setSummary] = useState<DashboardSummary>(DEFAULT_SUMMARY);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  const loadDashboard = useCallback(async (): Promise<void> => {
    const [summaryData, projectData] = await Promise.all([fetchDashboardSummary(), fetchProjects()]);
    flushSync(() => {
      setSummary(summaryData ?? DEFAULT_SUMMARY);
      setProjects(Array.isArray(projectData) ? projectData : []);
    });
  }, []);

  const loadProjects = useCallback(async (): Promise<void> => {
    const projectData = await fetchProjects();
    flushSync(() => {
      setProjects(Array.isArray(projectData) ? projectData : []);
    });
  }, []);

  useEffect(() => {
    const handleHashChange = (): void => {
      setRoute(parseRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        if (route === '/dashboard') {
          await loadDashboard();
        } else {
          await loadProjects();
        }
      } catch {
        if (cancelled) {
          return;
        }

        if (route === '/dashboard') {
          setSummary(DEFAULT_SUMMARY);
          setProjects([]);
        } else {
          setProjects([]);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadDashboard, loadProjects, route]);

  const handleProjectCreated = useCallback((project: ProjectResponse): void => {
    flushSync(() => {
      setProjects((currentProjects) => {
        const nextProjects = [project, ...currentProjects.filter(({ id }) => id !== project.id)];
        if (route === '/dashboard') {
          setSummary(buildSummary(nextProjects));
        }
        return nextProjects;
      });
    });
  }, [route]);

  const handleCreateProject = useCallback(async (request: CreateProjectRequest): Promise<ProjectResponse> => {
    return createProject(request);
  }, []);

  return (
    <div className="pp-dash">
      <TopBar />
      <div className="pp-dash__body">
        <Sidebar activeRoute={route} />
        <main className="pp-dash__content">
          {route === '/dashboard' ? (
            <DashboardPage summary={summary} projects={projects} />
          ) : (
            <ProjectsPage
              projects={projects}
              onCreateProject={handleCreateProject}
              onProjectCreated={handleProjectCreated}
            />
          )}
        </main>
      </div>
    </div>
  );
};
