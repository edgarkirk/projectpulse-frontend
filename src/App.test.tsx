import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from './App';
import { getDashboardSummary, getProjects } from './api';

jest.mock('./api');

describe('App', () => {
  const mockedGetDashboardSummary = jest.mocked(getDashboardSummary);
  const mockedGetProjects = jest.mocked(getProjects);

  beforeEach(() => {
    mockedGetDashboardSummary.mockResolvedValue({
      totalProjects: 0,
      active: 0,
      atRisk: 0,
      blocked: 0,
      onHold: 0,
    });
    mockedGetProjects.mockResolvedValue([]);
  });

  afterEach(() => {
    mockedGetDashboardSummary.mockReset();
    mockedGetProjects.mockReset();
  });

  it('should_renderTheSidebarAndTopBar_whenTheAppLoads', async () => {
    window.location.hash = '#/dashboard';

    render(<App />);

    await waitFor(() => {
      expect(mockedGetDashboardSummary).toHaveBeenCalledTimes(1);
      expect(mockedGetProjects).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
  });

  it('should_navigateToProjects_whenProjectsIsClicked', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/dashboard';

    render(<App />);

    await waitFor(() => {
      expect(mockedGetDashboardSummary).toHaveBeenCalledTimes(1);
      expect(mockedGetProjects).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('link', { name: /projects/i }));

    await waitFor(() => {
      expect(mockedGetProjects).toHaveBeenCalledTimes(2);
    });

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('main')).toHaveTextContent(/projects/i);
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
  });

  it('should_renderTheTopBar_whenTheProjectsPageIsShown', async () => {
    window.location.hash = '#/projects';

    render(<App />);

    await waitFor(() => {
      expect(mockedGetProjects).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent(/projects/i);
  });
});