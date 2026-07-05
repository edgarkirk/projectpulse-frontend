import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import './App.css';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';

type Route = '/dashboard' | '/projects';

interface NavItem {
  route: Route;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    route: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
  },
  {
    route: '/projects',
    label: 'Projects',
    icon: '📁',
  },
];

function parseRoute(hash: string): Route {
  return hash === '#/projects' || hash === '/projects' ? '/projects' : '/dashboard';
}

function toHash(route: Route): string {
  return `#${route}`;
}

export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const handleHashChange = (): void => {
      setRoute(parseRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNavigate = useCallback(
    (nextRoute: Route) =>
      (event: MouseEvent<HTMLAnchorElement>): void => {
        event.preventDefault();
        window.location.hash = toHash(nextRoute);
        setRoute(nextRoute);
      },
    []
  );

  const content = route === '/projects' ? <ProjectsPage /> : <DashboardPage />;

  return (
    <div className="pp-dash">
      <header className="pp-topnav">
        <div className="pp-topnav__brand">ProjectPulse</div>
      </header>
      <div className="pp-dash__body">
        <nav className="pp-sidebar" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = route === item.route;

            return (
              <a
                key={item.route}
                className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
                href={toHash(item.route)}
                aria-current={isActive ? 'page' : undefined}
                onClick={handleNavigate(item.route)}
              >
                <span className="pp-sidebar__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="pp-sidebar__label">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <main className="pp-dash__content">{content}</main>
      </div>
    </div>
  );
}
