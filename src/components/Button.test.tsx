import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

describe('Button', () => {
  it('should_renderTheLabel_whenButtonIsDisplayed', () => {
    render(<Button>Save project</Button>);

    expect(screen.getByRole('button', { name: /save project/i })).toBeInTheDocument();
  });

  it('should_callOnClick_whenButtonIsActivated', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Save project</Button>);

    await user.click(screen.getByRole('button', { name: /save project/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should_not_callOnClick_whenButtonIsDisabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button disabled onClick={handleClick}>
        Save project
      </Button>
    );

    await user.click(screen.getByRole('button', { name: /save project/i }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
