import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from './App';

describe('App', () => {
  it('should_renderTheSidebarAndTopBar_whenTheAppLoads', () => {
    window.location.hash = '#/dashboard';

    render(<App />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('should_navigateToProjects_whenProjectsIsClicked', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/dashboard';

    render(<App />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('main')).toHaveTextContent(/projects/i);
  });
});
