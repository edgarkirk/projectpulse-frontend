import React from 'react';

export interface TopBarProps {
  applicationName: string;
}

export function TopBar({ applicationName }: TopBarProps): JSX.Element {
  return (
    <header>
      <h1>{applicationName}</h1>
    </header>
  );
}
