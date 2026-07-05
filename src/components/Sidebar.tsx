import type { MouseEvent } from 'react';

import './Sidebar.css';

export type RouteHash = '#/dashboard' | '#/projects';

const navigationItems: Array<{ route: RouteHash; label: string; icon: string }> = [
  { route: '#/dashboard', label: 'Dashboard', icon: '📊' },
  { route: '#/projects', label: 'Projects', icon: '📁' },
];

export interface SidebarProps {
  activeRoute: RouteHash;
  onNavigate?: (route: RouteHash) => void;
}

export const Sidebar = ({ activeRoute, onNavigate }: SidebarProps) => {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, route: RouteHash): void => {
    event.preventDefault();
    window.location.hash = route;
    onNavigate?.(route);
  };

  return (
    <nav className='pp-sidebar' aria-label='Main navigation'>
      {navigationItems.map((item) => {
        const isActive = activeRoute === item.route;

        return (
          <a
            key={item.route}
            className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
            href={item.route}
            aria-current={isActive ? 'page' : undefined}
            onClick={(event) => handleNavigate(event, item.route)}
          >
            <span className='pp-sidebar__icon' aria-hidden='true'>
              {item.icon}
            </span>
            <span className='pp-sidebar__label'>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};
