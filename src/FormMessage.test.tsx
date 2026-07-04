import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { FormMessage } from './components/FormMessage';

describe('FormMessage', () => {
  test('should announce errors to assistive technology', () => {
    render(<FormMessage variant="error" message="Name is required" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
    expect(screen.getByRole('alert')).toHaveClass('pp-form-message--error');
  });

  test('should render success feedback', () => {
    render(<FormMessage variant="success" message="Project created" />);

    expect(screen.getByRole('status')).toHaveTextContent('Project created');
    expect(screen.getByRole('status')).toHaveClass('pp-form-message--success');
  });
});
