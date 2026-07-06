import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#/dashboard';
  });

  it('should render the dashboard page for the dashboard route', () => {
    window.location.hash = '#/dashboard';

    render(<App />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should render the projects page for the projects route', () => {
    window.location.hash = '#/projects';

    render(<App />);

    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('should change the visible page when the projects link is activated', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/dashboard';

    render(<App />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
  });

  it('should always render the ProjectPulse brand text', () => {
    window.location.hash = '#/dashboard';

    render(<App />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});
