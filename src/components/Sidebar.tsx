import './Sidebar.css';
import type { AppRoute } from '../types';

interface SidebarProps {
  activeRoute: AppRoute;
}

interface SidebarItem {
  route: AppRoute;
  label: string;
  icon: string;
}

const NAV_ITEMS: SidebarItem[] = [
  { route: '/dashboard', label: 'Dashboard', icon: '📊' },
  { route: '/projects', label: 'Projects', icon: '📁' },
];

export const Sidebar = ({ activeRoute }: SidebarProps): JSX.Element => {
  return (
    <nav className="pp-sidebar" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;

        return (
          <a
            key={item.route}
            className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
            href={`#${item.route}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault();
              window.location.hash = item.route;
            }}
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
