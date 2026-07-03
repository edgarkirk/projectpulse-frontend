import { render, screen } from '@testing-library/react';

import { StatusTag } from './StatusTag';

describe('StatusTag', () => {
  const statuses: ReadonlyArray<'Active' | 'At Risk' | 'Blocked' | 'On Hold'> = ['Active', 'At Risk', 'Blocked', 'On Hold'];

  it.each(statuses)('should_labelTheBadge_whenStatusIs%p', (status) => {
    render(<StatusTag status={status} />);

    expect(screen.getByLabelText(`Status: ${status}`)).toHaveTextContent(status);
  });
});
