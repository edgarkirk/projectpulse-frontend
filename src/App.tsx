import './App.css';
import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import type { RoutePath } from './types';

const defaultRoute: RoutePath = '#/dashboard';

const routes: Record<RoutePath, () => JSX.Element> = {
  '#/dashboard': () => <DashboardPage />,
  '#/projects': () => <ProjectsPage />,
};

const getRouteFromHash = (): RoutePath => {
  return window.location.hash === '#/projects' ? '#/projects' : defaultRoute;
};

export const App = () => {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const PageComponent = routes[currentRoute] ?? routes[defaultRoute];

  const handleNavigate = (route: RoutePath) => {
    setCurrentRoute(route);
  };

  return (
    <div className="pp-dash">
      <TopBar applicationName="ProjectPulse" />
      <div className="pp-dash__body">
        <Sidebar activeRoute={currentRoute} onNavigate={handleNavigate} />
        <main className="pp-dash__content">
          <PageComponent />
        </main>
      </div>
    </div>
  );
};
