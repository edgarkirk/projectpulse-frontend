import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

jest.mock('./Dashboard', () => ({
  Dashboard: () => <h1>Dashboard</h1>,
}));

jest.mock('./Projects', () => ({
  Projects: () => <h1>Projects</h1>,
}));

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('should always display the ProjectPulse application name', () => {
    render(<App />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });

  it('should normalize the dashboard route into the URL on initial load', async () => {
    render(<App />);

    await waitFor(() => expect(window.location.hash).toBe('#/dashboard'));
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should navigate from the dashboard to the projects page without a full reload and update the active sidebar item', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('button', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
  });
});
