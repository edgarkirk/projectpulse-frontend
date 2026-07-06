import { render, screen } from '@testing-library/react';
import { StatusTag } from './StatusTag';

describe('StatusTag', () => {
  it('should render the active status label when status is Active', () => {
    render(<StatusTag status="Active" />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render the at risk status label when status is At Risk', () => {
    render(<StatusTag status="At Risk" />);

    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('should render the blocked status label when status is Blocked', () => {
    render(<StatusTag status="Blocked" />);

    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('should render the on hold status label when status is On Hold', () => {
    render(<StatusTag status="On Hold" />);

    expect(screen.getByText('On Hold')).toBeInTheDocument();
  });
});
