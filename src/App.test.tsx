jest.mock('./pages/DashboardPage', () => ({
  DashboardPage: () => null,
}));

jest.mock('./pages/ProjectsPage', () => ({
  ProjectsPage: () => null,
}));

import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App shell', () => {
  beforeEach(() => {
    window.location.hash = '#/dashboard';
  });

  it('should_displayProjectPulseAndSwitchPages_withoutFullReload', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
  });
});
