import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('should always display the application name', () => {
    render(<TopBar />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});
