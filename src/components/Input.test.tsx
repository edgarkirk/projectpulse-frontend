import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('should associate the label with the text field and report typing', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Input
        label="Project name"
        name="name"
        onChange={handleChange}
        placeholder="Enter a project name"
        required
        value=""
      />
    );

    const input = screen.getByLabelText(/project name/i);
    await user.type(input, 'Atlas Migration');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toBeRequired();
  });

  it('should keep the max length attribute on the field', () => {
    render(
      <Input
        label="Owner name"
        name="ownerName"
        onChange={jest.fn()}
        maxLength={100}
        value="Jane Doe"
      />
    );

    expect(screen.getByRole('textbox', { name: /owner name/i })).toHaveAttribute('maxlength', '100');
  });
});
