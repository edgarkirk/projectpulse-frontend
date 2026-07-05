import { useEffect, useState } from 'react';
import './App.css';
import { Dashboard } from './Dashboard';
import { Projects } from './Projects';

type Route = 'dashboard' | 'projects';

interface NavItem {
  route: Route;
  label: string;
  icon: string;
}

const navItems: ReadonlyArray<NavItem> = [
  { route: 'dashboard', label: 'Dashboard', icon: '📊' },
  { route: 'projects', label: 'Projects', icon: '📁' },
];

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

  return (
    <div className="pp-dash">
      <header className="pp-topnav">
        <div className="pp-topnav__brand">ProjectPulse</div>
      </header>
      <div className="pp-dash__body">
        <nav className="pp-sidebar" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = route === item.route;

            return (
              <button
                key={item.route}
                type="button"
                className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(item.route)}
              >
                <span className="pp-sidebar__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="pp-sidebar__label">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <main className="pp-dash__content">{route === 'dashboard' ? <Dashboard /> : <Projects />}</main>
      </div>
    </div>
  );
}
