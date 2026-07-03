import { render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('should_renderAccessibleLabel_when_rendered', () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Save project</Button>);

    expect(screen.getByRole('button', { name: /save project/i })).toBeInTheDocument();
  });

  it('should_reflectDisabledState_when_disabled', () => {
    render(<Button disabled>Save project</Button>);

    expect(screen.getByRole('button', { name: /save project/i })).toBeDisabled();
  });
});
