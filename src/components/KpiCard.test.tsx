import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('should render the KPI title and count', () => {
    render(<KpiCard title="Total Projects" value={6} />);

    expect(screen.getByText(/total projects/i)).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should render a zero count without hiding it', () => {
    render(<KpiCard title="On Hold" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
