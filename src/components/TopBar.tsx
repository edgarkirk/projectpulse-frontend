import React from 'react';
import './TopBar.css';

export interface TopBarProps {
  title?: string;
}

export function TopBar({ title = 'ProjectPulse' }: TopBarProps): JSX.Element {
  return (
    <header className="pp-topbar">
      <div className="pp-topbar__brand">{title}</div>
    </header>
  );
}
