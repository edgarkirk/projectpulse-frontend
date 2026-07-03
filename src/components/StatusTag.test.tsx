import { render, screen } from '@testing-library/react';

import { StatusTag } from './StatusTag';

describe('StatusTag', () => {
  it.each([
    ['Active'],
    ['At Risk'],
    ['Blocked'],
    ['On Hold'],
  ] as const)('should_labelTheBadge_whenStatusIs%p', (status) => {
    render(<StatusTag status={status} />);

    expect(screen.getByLabelText(`Status: ${status}`)).toHaveTextContent(status);
  });
});
