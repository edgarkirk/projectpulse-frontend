import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('should render the ProjectPulse application name on every page', () => {
    render(<TopBar applicationName="ProjectPulse" />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});
