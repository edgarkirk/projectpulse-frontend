import './Sidebar.css';

export type SidebarRoute = 'dashboard' | 'projects';

export interface SidebarProps {
  activeRoute: SidebarRoute;
  onNavigate: (route: SidebarRoute) => void;
}

const navigationItems: ReadonlyArray<{ route: SidebarRoute; label: string; icon: string }> = [
  { route: 'dashboard', label: 'Dashboard', icon: '📊' },
  { route: 'projects', label: 'Projects', icon: '📁' },
];

export function Sidebar({ activeRoute, onNavigate }: SidebarProps): JSX.Element {
  return (
    <nav aria-label="Main navigation" className="pp-sidebar">
      {navigationItems.map((item) => {
        const isActive = item.route === activeRoute;

        return (
          <a
            aria-current={isActive ? 'page' : undefined}
            className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
            href={`#/${item.route}`}
            key={item.route}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(item.route);
            }}
          >
            <span aria-hidden="true" className="pp-sidebar__icon">
              {item.icon}
            </span>
            <span className="pp-sidebar__label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
