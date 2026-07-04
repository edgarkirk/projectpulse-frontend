import React from 'react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('./pages/DashboardPage', () => ({
  __esModule: true,
  DashboardPage: () => <main>Dashboard page</main>,
}));

jest.mock('./pages/ProjectsPage', () => ({
  __esModule: true,
  ProjectsPage: () => <main>Projects page</main>,
}));

import { App } from './App';

beforeEach(() => {
  window.location.hash = '';
});

describe('App shell', () => {
  test('should navigate to Projects through hash-based routing', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /projects/i }));

    await waitFor(() => {
      expect(screen.getByText('Projects page')).toBeInTheDocument();
    });

    expect(window.location.hash).toBe('#/projects');
  });

  test('should highlight the active sidebar item for the current hash route', () => {
    window.location.hash = '#/projects';

    render(<App />);

    expect(screen.getByRole('button', { name: /projects/i })).toHaveClass('pp-sidebar__item--active');
  });
});
