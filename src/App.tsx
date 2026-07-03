import React from 'react';

import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';

export function App(): JSX.Element {
  return (
    <div>
      <TopBar applicationName='ProjectPulse' />
      <DashboardPage />
    </div>
  );
}
