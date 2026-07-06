import './App.css';
import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';

type RoutePath = '/dashboard' | '/projects';

const routes: Record<RoutePath, () => JSX.Element> = {
  '/dashboard': () => <DashboardPage />,
  '/projects': () => <ProjectsPage />,
};

const defaultRoute: RoutePath = '/dashboard';

function isRoutePath(value: string): value is RoutePath {
  return value === '/dashboard' || value === '/projects';
}

function getRouteFromHash(): RoutePath {
  const hash = window.location.hash.slice(1);
  return isRoutePath(hash) ? hash : defaultRoute;
}

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

  const Page = routes[currentRoute];

  return (
    <div className="pp-dash">
      <TopBar />
      <div className="pp-dash__body">
        <Sidebar activePath={currentRoute} />
        <main className="pp-dash__content">
          <Page />
        </main>
      </div>
    </div>
  );
};
