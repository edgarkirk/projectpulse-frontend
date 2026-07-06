import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    window.location.hash = '#/dashboard';
  });

  it('should render dashboard and projects navigation items', () => {
    render(<Sidebar activePath="/dashboard" />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('should mark the active route when the dashboard page is active', () => {
    render(<Sidebar activePath="/dashboard" />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
  });

  it('should update the hash when the projects link is activated', async () => {
    const user = userEvent.setup();
    render(<Sidebar activePath="/dashboard" />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
  });
});
