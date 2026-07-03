import { render, screen } from '@testing-library/react';

import { StatusTag } from './StatusTag';
import type { ProjectStatus } from '../types';

describe('StatusTag', () => {
  const statuses: ProjectStatus[] = ['Active', 'At Risk', 'Blocked', 'On Hold'];

  it.each(statuses)('should_renderAccessibleBadge_for_%s', (status) => {
    render(<StatusTag status={status} />);

    expect(screen.getByLabelText(`Status: ${status}`)).toBeInTheDocument();
  });

  it.each(statuses)('should_applyStatusSpecificStyling_for_%s', (status) => {
    render(<StatusTag status={status} />);

    expect(screen.getByText(status)).toHaveClass('status-tag');
  });
});
