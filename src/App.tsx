import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { TopBar } from './components/TopBar';
import { Sidebar, type SidebarRoute } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';

function getRouteFromHash(hash: string): SidebarRoute {
  if (hash === '#/projects') {
    return 'projects';
  }

  return 'dashboard';
}

export function App(): JSX.Element {
  const [route, setRoute] = useState<SidebarRoute>(() => getRouteFromHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = (): void => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    if (window.location.hash === '') {
      window.location.hash = '#/dashboard';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNavigate = useCallback((nextRoute: SidebarRoute) => {
    const nextHash = `#/${nextRoute}`;

    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }

    setRoute(nextRoute);
  }, []);

  return (
    <div className="pp-dash">
      <TopBar />
      <div className="pp-dash__body">
        <Sidebar activeRoute={route} onNavigate={handleNavigate} />
        <main className="pp-dash__content">{route === 'dashboard' ? <DashboardPage /> : <ProjectsPage />}</main>
      </div>
    </div>
  );
}
