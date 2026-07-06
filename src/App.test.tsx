import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

jest.mock('./pages/DashboardPage', () => ({
  __esModule: true,
  DashboardPage: () => <h1>Dashboard</h1>,
}));

jest.mock('./pages/ProjectsPage', () => ({
  __esModule: true,
  ProjectsPage: () => <h1>Projects</h1>,
}));

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('should render the dashboard route when the hash is empty', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should render the dashboard route when the hash points to dashboard', () => {
    window.location.hash = '#/dashboard';

    render(<App />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should render the projects route when the hash points to projects', () => {
    window.location.hash = '#/projects';

    render(<App />);

    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('should change the visible page to projects when the sidebar link is clicked', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/dashboard';

    render(<App />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('should fall back to dashboard for an unknown hash', () => {
    window.location.hash = '#/unknown';

    render(<App />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
