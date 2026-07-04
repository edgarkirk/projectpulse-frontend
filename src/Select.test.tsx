import React, { useState } from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './components/Select';

function SelectHarness(): JSX.Element {
  const [value, setValue] = useState('Active');

  return (
    <Select
      id="status"
      label="Status"
      value={value}
      onChange={setValue}
      options={[
        { value: 'Active', label: 'Active' },
        { value: 'Blocked', label: 'Blocked' },
        { value: 'On Hold', label: 'On Hold' },
      ]}
    />
  );
}

describe('Select', () => {
  test('should render the status options', () => {
    render(
      <Select
        id="status"
        label="Status"
        value="Active"
        onChange={() => undefined}
        options={[
          { value: 'Active', label: 'Active' },
          { value: 'At Risk', label: 'At Risk' },
        ]}
      />
    );

    expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /at risk/i })).toBeInTheDocument();
  });

  test('should notify when the value changes', async () => {
    const user = userEvent.setup();

    render(<SelectHarness />);
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Blocked');

    expect(screen.getByRole('combobox', { name: /status/i })).toHaveValue('Blocked');
  });

  test('should keep the selected value in sync', () => {
    render(
      <Select
        id="status"
        label="Status"
        value="On Hold"
        onChange={() => undefined}
        options={[
          { value: 'On Hold', label: 'On Hold' },
        ]}
      />
    );

    expect(screen.getByDisplayValue('On Hold')).toBeInTheDocument();
  });
});
