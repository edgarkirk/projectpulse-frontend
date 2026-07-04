import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { TopBar } from './components/TopBar';

describe('TopBar', () => {
  test('should display the ProjectPulse brand name', () => {
    render(<TopBar title="ProjectPulse" />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});
