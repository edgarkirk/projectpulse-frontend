import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('should render only the dashboard and projects links', () => {
    render(<Sidebar activeRoute="dashboard" onNavigate={jest.fn()} />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('should notify navigation when the projects item is selected', async () => {
    const user = userEvent.setup();
    const handleNavigate = jest.fn();

    render(<Sidebar activeRoute="dashboard" onNavigate={handleNavigate} />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(handleNavigate).toHaveBeenCalledWith('projects');
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
  });
});
