import { render, screen } from '@testing-library/react';

import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('should_renderTheLabelAndValue_whenCardIsDisplayed', () => {
    render(<KpiCard label='Total Projects' value={6} />);

    expect(screen.getByText(/total projects/i)).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should_exposeTheCountAsAStatusRegion_whenCardIsRendered', () => {
    render(<KpiCard label='Active' value={3} />);

    expect(screen.getByRole('status')).toHaveTextContent('3');
  });
});
