import { useCallback, useEffect, useState } from 'react';

import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import type { RouteName } from './types';

const parseRoute = (hash: string): RouteName => {
  if (hash === '#/projects') {
    return 'projects';
  }

  return 'dashboard';
};

export const App = () => {
  const [activeRoute, setActiveRoute] = useState<RouteName>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const handleHashChange = (): void => {
      setActiveRoute(parseRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback((route: RouteName) => {
    const nextHash = `#/${route}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    setActiveRoute(route);
  }, []);

  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-layout">
        <Sidebar activeRoute={activeRoute} onNavigate={handleNavigate} />
        {activeRoute === 'dashboard' ? <DashboardPage /> : <ProjectsPage />}
      </div>
    </div>
  );
};
