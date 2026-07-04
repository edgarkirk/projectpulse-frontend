import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { StatusTag } from './components/StatusTag';

describe('StatusTag', () => {
  test('should render a success badge for Active projects', () => {
    render(<StatusTag status="Active" />);

    expect(screen.getByText('Active')).toHaveClass('pp-tag--success');
    expect(screen.getByLabelText('Status: Active')).toBeInTheDocument();
  });

  test('should render an info badge for On Hold projects', () => {
    render(<StatusTag status="On Hold" />);

    expect(screen.getByText('On Hold')).toHaveClass('pp-tag--info');
    expect(screen.getByLabelText('Status: On Hold')).toBeInTheDocument();
  });
});
