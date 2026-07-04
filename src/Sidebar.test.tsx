import React from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './components/Sidebar';

describe('Sidebar', () => {
  test('should render exactly two navigation items', () => {
    render(<Sidebar currentPath="#/dashboard" onNavigate={() => undefined} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('should navigate to Projects when the item is clicked', async () => {
    const onNavigate = jest.fn();
    const user = userEvent.setup();

    render(<Sidebar currentPath="#/dashboard" onNavigate={onNavigate} />);
    await user.click(screen.getByRole('button', { name: /projects/i }));

    expect(onNavigate).toHaveBeenCalledWith('#/projects');
  });

  test('should highlight the active route', () => {
    render(<Sidebar currentPath="#/projects" onNavigate={() => undefined} />);

    expect(screen.getByRole('button', { name: /projects/i })).toHaveClass('pp-sidebar__item--active');
  });
});
