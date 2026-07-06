import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('should render the KPI label and value', () => {
    render(<KpiCard label="Total Projects" value={6} />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should render zero values without changing the number', () => {
    render(<KpiCard label="Blocked" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
