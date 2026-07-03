import { render, screen } from '@testing-library/react';

import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('should_renderTheApplicationName_whenTopBarIsDisplayed', () => {
    render(<TopBar applicationName='ProjectPulse' />);

    expect(screen.getByRole('banner')).toHaveTextContent('ProjectPulse');
  });
});
