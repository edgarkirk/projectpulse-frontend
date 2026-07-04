import React from 'react';
import { describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './components/Button';

describe('Button', () => {
  test('should render the provided label', () => {
    render(<Button type="button">Save Project</Button>);

    expect(screen.getByRole('button', { name: /save project/i })).toBeInTheDocument();
  });

  test('should call the click handler when activated', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Create</Button>);
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('should not fire when disabled', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={onClick}>Create</Button>);
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
