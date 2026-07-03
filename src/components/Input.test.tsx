import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  it('should_linkLabelAndInput_when_rendered', async () => {
    const user = userEvent.setup();
    const handleChange: jest.Mock<void, [string]> = jest.fn();

    render(
      <Input
        id="project-name"
        label="Project name"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText(/project name/i);
    await user.type(input, 'Atlas Migration');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should_renderValidationMessage_withRoleAlert_when_errorProvided', () => {
    const handleChange: jest.Mock<void, [string]> = jest.fn();

    render(
      <Input
        id="project-owner"
        label="Owner name"
        value="Jane Doe"
        onChange={handleChange}
        errorMessage="owner name exceeds maximum length"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'owner name exceeds maximum length'
    );
  });
});
