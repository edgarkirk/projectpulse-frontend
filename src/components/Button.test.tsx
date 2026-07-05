import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render the button label and invoke the click handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Save project</Button>);

    await user.click(screen.getByRole('button', { name: /save project/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should stay disabled when the disabled flag is set', () => {
    render(
      <Button disabled type="button">
        Save project
      </Button>
    );

    expect(screen.getByRole('button', { name: /save project/i })).toBeDisabled();
  });
});
