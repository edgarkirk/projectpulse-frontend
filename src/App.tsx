import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import './App.css';

import { Sidebar, type RouteHash } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';

const defaultRoute: RouteHash = '#/dashboard';

const routes: Record<RouteHash, () => ReactElement> = {
  '#/dashboard': () => <DashboardPage />,
  '#/projects': () => <ProjectsPage />,
};

const normalizeRoute = (route: string): RouteHash => {
  return route === '#/projects' ? '#/projects' : '#/dashboard';
};

const getRouteFromHash = (): RouteHash => {
  return normalizeRoute(window.location.hash);
};

export const App = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteHash>(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = (): void => {
      setCurrentRoute(getRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const PageComponent = routes[currentRoute] ?? routes[defaultRoute];

  return (
    <div className='pp-dash'>
      <TopBar />
      <div className='pp-dash__body'>
        <Sidebar activeRoute={currentRoute} />
        <main className='pp-dash__content'>
          <PageComponent />
        </main>
      </div>
    </div>
  );
};
