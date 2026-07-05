import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('App shell', () => {
  beforeEach(() => {
    window.location.hash = '#/dashboard';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display the ProjectPulse brand in the top bar', async () => {
    const modulePath = './App';
    const appModule = await import(modulePath);
    const App = appModule.App;

    render(<App />);

    expect(screen.getByRole('banner')).toHaveTextContent('ProjectPulse');
  });

  it('should navigate to the Projects page when the sidebar item is clicked', async () => {
    const user = userEvent.setup();
    const modulePath = './App';
    const appModule = await import(modulePath);
    const App = appModule.App;

    render(<App />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(window.location.hash).toBe('#/projects');
    expect(screen.getByRole('link', { name: /projects/i, current: 'page' })).toBeInTheDocument();
  });

  it('should highlight the active route on both Dashboard and Projects pages', async () => {
    const modulePath = './App';
    const appModule = await import(modulePath);
    const App = appModule.App;

    window.location.hash = '#/projects';
    render(<App />);

    expect(screen.getByRole('link', { name: /projects/i, current: 'page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });
});
