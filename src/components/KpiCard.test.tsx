import { render, screen } from '@testing-library/react';

import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('should_renderLabelAndValue_insideAnAccessibleRegion', () => {
    render(<KpiCard label="Total Projects" value={6} />);

    expect(screen.getByRole('region', { name: /total projects/i })).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should_renderZeroCounts_withoutHidingThem', () => {
    render(<KpiCard label="On Hold" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
