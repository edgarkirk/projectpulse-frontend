import React from 'react';

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
