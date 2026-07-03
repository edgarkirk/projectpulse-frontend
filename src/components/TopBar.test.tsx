import { render, screen } from '@testing-library/react';

import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('should_displayApplicationName', () => {
    render(<TopBar />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});
