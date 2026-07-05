import { useEffect, useState } from 'react';
import { Dashboard } from './Dashboard';
import { Projects } from './Projects';

type Route = 'dashboard' | 'projects';

function getRouteFromHash(hash: string): Route {
  if (hash === '#/projects') {
    return 'projects';
  }

  return 'dashboard';
}

export function App() {
  const [route, setRoute] = useState<Route>(() => getRouteFromHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (nextRoute: Route) => {
    const nextHash = `#/${nextRoute}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    setRoute(nextRoute);
  };

  const isDashboard = route === 'dashboard';

  return (
    <div>
      <header>
        <div>ProjectPulse</div>
      </header>
      <aside aria-label="sidebar">
        <button type="button" aria-current={isDashboard ? 'page' : undefined} onClick={() => navigate('dashboard')}>
          Dashboard
        </button>
        <button type="button" aria-current={isDashboard ? undefined : 'page'} onClick={() => navigate('projects')}>
          Projects
        </button>
      </aside>
      {isDashboard ? <Dashboard /> : <Projects />}
    </div>
  );
}
