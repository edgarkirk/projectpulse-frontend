import React, { useEffect, useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

export type AppRoute = '#/dashboard' | '#/projects';

function isAppRoute(value: string): value is AppRoute {
  return value === '#/dashboard' || value === '#/projects';
}

function resolveRoute(hash: string): AppRoute {
  return isAppRoute(hash) ? hash : '#/dashboard';
}

export function App(): JSX.Element {
  const [currentPath, setCurrentPath] = useState<AppRoute>(resolveRoute(window.location.hash));

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/dashboard';
      setCurrentPath('#/dashboard');
    }

    function handleHashChange(): void {
      setCurrentPath(resolveRoute(window.location.hash));
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  function handleNavigate(path: string): void {
    const route = resolveRoute(path);
    if (window.location.hash !== route) {
      window.location.hash = route;
    }
    setCurrentPath(route);
  }

  return (
    <div className="pp-app">
      <TopBar title="ProjectPulse" />
      <div className="pp-app__body">
        <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
        <div className="pp-app__content">
          {currentPath === '#/projects' ? <ProjectsPage /> : <DashboardPage />}
        </div>
      </div>
    </div>
  );
}
