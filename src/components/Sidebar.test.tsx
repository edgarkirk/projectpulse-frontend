import { render, screen } from '@testing-library/react';

import { Sidebar } from './Sidebar';
import type { RouteName } from '../types';

describe('Sidebar', () => {
  it('should_renderDashboardAndProjectsNavigation', () => {
    const onNavigate: jest.Mock<void, [RouteName]> = jest.fn();

    render(<Sidebar activeRoute="dashboard" onNavigate={onNavigate} />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('should_markTheActivePage_withAriaCurrent', () => {
    const onNavigate: jest.Mock<void, [RouteName]> = jest.fn();

    render(<Sidebar activeRoute="projects" onNavigate={onNavigate} />);

    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
  });
});
