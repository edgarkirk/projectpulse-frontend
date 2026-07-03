import React from 'react';

export type Route = 'dashboard' | 'projects';

export interface SidebarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

interface NavItem {
  route: Route;
  label: string;
  hash: string;
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    route: 'dashboard',
    label: 'Dashboard',
    hash: '#/dashboard',
  },
  {
    route: 'projects',
    label: 'Projects',
    hash: '#/projects',
  },
];

export function Sidebar({ currentRoute, onNavigate }: SidebarProps): JSX.Element {
  const handleNavigate = (item: NavItem) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.hash = item.hash;
    onNavigate(item.route);
  };

  return (
    <nav aria-label="Sidebar">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.route}>
            <a
              href={item.hash}
              aria-current={currentRoute === item.route ? 'page' : undefined}
              data-active={currentRoute === item.route ? 'true' : 'false'}
              onClick={handleNavigate(item)}
              style={{
                fontWeight: currentRoute === item.route ? 700 : 400,
                textDecoration: currentRoute === item.route ? 'underline' : 'none',
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
