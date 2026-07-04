import React from 'react';

export interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface SidebarItem {
  label: string;
  path: string;
}

const items: ReadonlyArray<SidebarItem> = [
  { label: 'Dashboard', path: '#/dashboard' },
  { label: 'Projects', path: '#/projects' },
];

export function Sidebar({ currentPath, onNavigate }: SidebarProps): JSX.Element {
  return (
    <nav className="pp-sidebar" aria-label="Sidebar">
      <ul className="pp-sidebar__list">
        {items.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <li key={item.path} className="pp-sidebar__item-wrap">
              <button
                type="button"
                className={`pp-sidebar__item${isActive ? ' pp-sidebar__item--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.path)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
