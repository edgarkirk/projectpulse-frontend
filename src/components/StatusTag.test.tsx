import { render, screen } from '@testing-library/react';
import { StatusTag } from './StatusTag';
import type { ProjectStatus } from '../types';

describe('StatusTag', () => {
  it.each<ProjectStatus>(['Active', 'At Risk', 'Blocked', 'On Hold'])
    ('should render the %s status when the badge is displayed', (status) => {
      render(<StatusTag status={status} />);

      expect(screen.getByText(status)).toBeInTheDocument();
    });
});
