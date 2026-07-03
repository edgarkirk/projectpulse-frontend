import type { MouseEvent } from 'react';

import type { RouteName } from '../types';

export interface SidebarProps {
  activeRoute: RouteName;
  onNavigate: (route: RouteName) => void;
}

const navItems: Array<{ label: string; route: RouteName }> = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Projects', route: 'projects' },
];

export const Sidebar = ({ activeRoute, onNavigate }: SidebarProps) => {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, route: RouteName): void => {
    event.preventDefault();
    onNavigate(route);
  };

  return (
    <nav aria-label="Primary">
      <ul>
        {navItems.map((item) => (
          <li key={item.route}>
            <a
              href={`#/${item.route}`}
              onClick={(event) => handleNavigate(event, item.route)}
              aria-current={activeRoute === item.route ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
