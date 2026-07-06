import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('should render the KPI label and count when data is provided', () => {
    render(<KpiCard label="Total Projects" count={6} />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should render zero counts when the KPI value is empty', () => {
    render(<KpiCard label="Blocked" count={0} />);

    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
