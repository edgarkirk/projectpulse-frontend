import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('should render the ProjectPulse brand text', () => {
    render(<TopBar />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});
