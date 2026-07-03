import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Select } from './Select';

describe('Select', () => {
  const options = [
    { label: 'Active', value: 'Active' },
    { label: 'At Risk', value: 'At Risk' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  it('should_renderTheOptions_whenSelectIsDisplayed', () => {
    render(<Select id='project-status' label='Status' value='Active' options={options} onChange={jest.fn()} />);

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument();
  });

  it('should_callOnChange_whenUserChoosesAnotherOption', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Select id='project-status' label='Status' value='Active' options={options} onChange={handleChange} />);

    await user.selectOptions(screen.getByLabelText(/status/i), 'Blocked');

    expect(handleChange).toHaveBeenCalledWith('Blocked');
  });

  it('should_keepTheCurrentSelection_whenDisplayed', () => {
    render(<Select id='project-status' label='Status' value='On Hold' options={options} onChange={jest.fn()} />);

    expect(screen.getByLabelText(/status/i)).toHaveValue('On Hold');
  });
});
