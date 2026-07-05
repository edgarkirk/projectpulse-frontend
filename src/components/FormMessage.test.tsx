import { render, screen } from '@testing-library/react';
import { FormMessage } from './FormMessage';

describe('FormMessage', () => {
  it('should announce error messages with alert role', () => {
    render(<FormMessage message="Project name already taken" variant="error" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Project name already taken');
  });

  it('should announce success messages with status role', () => {
    render(<FormMessage message="Project created" variant="success" />);

    expect(screen.getByRole('status')).toHaveTextContent('Project created');
  });

  it('should render nothing when there is no message', () => {
    render(<FormMessage message={null} variant="error" />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
