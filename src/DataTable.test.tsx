import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { DataTable } from './components/DataTable';

describe('DataTable', () => {
  test('should render the requested headers', () => {
    render(<DataTable title="Projects" headers={["Name", "Owner", "Status"]} />);

    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Owner' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  });

  test('should not add extra UI columns', () => {
    render(<DataTable title="Projects" headers={["Name", "Owner", "Status"]} />);

    expect(screen.queryByRole('columnheader', { name: 'ID' })).not.toBeInTheDocument();
  });
});
