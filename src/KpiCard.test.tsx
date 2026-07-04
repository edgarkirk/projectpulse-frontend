import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { KpiCard } from './components/KpiCard';

describe('KpiCard', () => {
  test('should render the label and value', () => {
    render(<KpiCard label="Total Projects" value={6} />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  test('should render the value as a number', () => {
    render(<KpiCard label="Blocked" value={1} />);

    expect(screen.getByText('1')).toBeVisible();
  });
});
