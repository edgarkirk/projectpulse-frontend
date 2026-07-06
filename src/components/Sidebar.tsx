import './Sidebar.css';
import type { MouseEvent } from 'react';
import type { RoutePath } from '../types';

export interface SidebarProps {
  activeRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
}

const navigationItems: Array<{ route: RoutePath; label: string; icon: string }> = [
  { route: '#/dashboard', label: 'Dashboard', icon: '📊' },
  { route: '#/projects', label: 'Projects', icon: '📁' },
];

export const Sidebar = ({ activeRoute, onNavigate }: SidebarProps) => {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, route: RoutePath) => {
    event.preventDefault();
    if (window.location.hash !== route) {
      window.location.hash = route;
    }
    onNavigate(route);
  };

  return (
    <nav className="pp-sidebar" aria-label="Main navigation">
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
            <span className="pp-sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="pp-sidebar__label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};
