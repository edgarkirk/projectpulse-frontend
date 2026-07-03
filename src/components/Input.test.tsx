import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from './Input';

describe('Input', () => {
  it('should_renderTheLabelAndValue_whenInputIsDisplayed', () => {
    render(<Input id='project-name' label='Project name' value='Atlas Migration' onChange={jest.fn()} />);

    expect(screen.getByLabelText(/project name/i)).toHaveValue('Atlas Migration');
  });

  it('should_callOnChange_whenUserTypesIntoTheInput', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input id='project-name' label='Project name' value='' onChange={handleChange} />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should_renderTheErrorMessage_whenValidationFails', () => {
    render(
      <Input
        id='project-name'
        label='Project name'
        value=''
        onChange={jest.fn()}
        error='name is required'
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('name is required');
  });
});
