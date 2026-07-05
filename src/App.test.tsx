import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from './App';

describe('App', () => {
  it('should render the dashboard page for the dashboard hash route', () => {
    window.location.hash = '#/dashboard';

    render(<App />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should render the projects page for the projects hash route', () => {
    window.location.hash = '#/projects';

    render(<App />);

    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('should update the hash and switch to the projects page when the sidebar link is clicked', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/dashboard';

    render(<App />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });
});
