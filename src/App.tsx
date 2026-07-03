import React, { useEffect, useState } from 'react';

import { TopBar } from './components/TopBar';
import { Sidebar, type Route } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';

function getRouteFromHash(hash: string): Route {
  return hash === '#/projects' ? 'projects' : 'dashboard';
}

export function App(): JSX.Element {
  const [route, setRoute] = useState<Route>(() => getRouteFromHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = (): void => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    if (window.location.hash !== '#/dashboard' && window.location.hash !== '#/projects') {
      window.location.hash = '#/dashboard';
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div>
      <TopBar applicationName="ProjectPulse" />
      <Sidebar currentRoute={route} onNavigate={setRoute} />
      {route === 'projects' ? <ProjectsPage /> : <DashboardPage />}
    </div>
  );
}
