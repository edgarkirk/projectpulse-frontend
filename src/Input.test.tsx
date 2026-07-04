import React, { useState } from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './components/Input';

function InputHarness(): JSX.Element {
  const [value, setValue] = useState('Jane');

  return (
    <Input
      id="owner-name"
      label="Owner Name"
      value={value}
      onChange={setValue}
    />
  );
}

describe('Input', () => {
  test('should associate the label with the field', () => {
    render(<Input id="project-name" label="Project Name" value="" onChange={() => undefined} />);

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
  });

  test('should update the value as the user types', async () => {
    const user = userEvent.setup();

    render(<InputHarness />);
    await user.type(screen.getByLabelText(/owner name/i), ' Doe');

    expect(screen.getByLabelText(/owner name/i)).toHaveValue('Jane Doe');
  });

  test('should expose the required state to assistive tech', () => {
    render(<Input id="project-name" label="Project Name" value="" onChange={() => undefined} required />);

    expect(screen.getByLabelText(/project name/i)).toBeRequired();
  });
});
