import './Sidebar.css';

interface SidebarProps {
  activePath: '/dashboard' | '/projects';
}

const navItems: Array<{
  path: '/dashboard' | '/projects';
  label: string;
  icon: string;
}> = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: '📁',
  },
];

export const Sidebar = ({ activePath }: SidebarProps) => (
  <nav className="pp-sidebar" aria-label="Main navigation">
    {navItems.map((item) => {
      const isActive = activePath === item.path;

      return (
        <a
          key={item.path}
          className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
          href={`#${item.path}`}
          aria-current={isActive ? 'page' : undefined}
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
