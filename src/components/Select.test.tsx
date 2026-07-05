import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'At Risk', value: 'At Risk' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  it('should render the placeholder and notify when the value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Select
        label="Status"
        name="status"
        onChange={handleChange}
        options={statusOptions}
        placeholder="Select a status"
        required
        value=""
      />
    );

    const select = screen.getByLabelText(/status/i);
    expect(screen.getByRole('option', { name: /select a status/i })).toBeDisabled();

    await user.selectOptions(select, 'Active');

    expect(handleChange).toHaveBeenCalled();
    expect(select).toBeRequired();
  });

  it('should keep the currently selected status visible', () => {
    render(
      <Select
        label="Status"
        name="status"
        onChange={jest.fn()}
        options={statusOptions}
        placeholder="Select a status"
        value="Blocked"
      />
    );

    expect(screen.getByDisplayValue('Blocked')).toBeInTheDocument();
  });
});
