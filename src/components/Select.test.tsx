import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { Select } from './Select';

describe('Select', () => {
  const options = [
    { label: 'Active', value: 'Active' },
    { label: 'At Risk', value: 'At Risk' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  it('should_renderDropdownOptions_when_rendered', () => {
    const handleChange: jest.Mock<void, [string]> = jest.fn();

    render(
      <Select
        id="project-status"
        label="Project status"
        value="Active"
        options={options}
        onChange={handleChange}
        ariaLabel="Project status"
      />
    );

    expect(screen.getByLabelText(/project status/i)).toHaveValue('Active');
  });

  it('should_updateSelection_when_userChoosesDifferentStatus', async () => {
    const user = userEvent.setup();
    const handleChange: jest.Mock<void, [string]> = jest.fn();

    render(
      <Select
        id="project-status"
        label="Project status"
        value="Active"
        options={options}
        onChange={handleChange}
        ariaLabel="Project status"
      />
    );

    await user.selectOptions(screen.getByLabelText(/project status/i), 'Blocked');

    expect(handleChange).toHaveBeenCalledWith('Blocked');
  });
});
