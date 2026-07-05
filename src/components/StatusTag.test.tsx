import { render, screen } from '@testing-library/react';
import { StatusTag } from './StatusTag';

const statuses: ReadonlyArray<'Active' | 'At Risk' | 'Blocked' | 'On Hold'> = [
  'Active',
  'At Risk',
  'Blocked',
  'On Hold',
];

describe('StatusTag', () => {
  it.each(statuses)('should render the status label for %s projects', (status) => {
    render(<StatusTag status={status} />);

    expect(screen.getByText(status)).toBeInTheDocument();
  });
});
