import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('should render exactly two navigation items when the sidebar is shown', () => {
    render(<Sidebar activeRoute="#/dashboard" onNavigate={jest.fn()} />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('should mark the active navigation item when the dashboard route is selected', () => {
    render(<Sidebar activeRoute="#/dashboard" onNavigate={jest.fn()} />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
  });

  it('should call onNavigate with the projects route when projects is clicked', async () => {
    const user = userEvent.setup();
    const handleNavigate = jest.fn();

    render(<Sidebar activeRoute="#/dashboard" onNavigate={handleNavigate} />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(handleNavigate).toHaveBeenCalledWith('#/projects');
  });
});
