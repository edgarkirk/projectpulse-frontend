import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateProjectForm } from './CreateProjectForm';

describe('CreateProjectForm', () => {
  it('should render all project fields and the submit button', () => {
    const handleSubmit = jest.fn();

    render(<CreateProjectForm onSubmit={handleSubmit} />);

    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Owner Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });

  it('should call onSubmit with entered values and clear the form after success', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockResolvedValue(undefined);

    render(<CreateProjectForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Project Name'), 'Atlas Migration');
    await user.type(screen.getByLabelText('Owner Name'), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText('Status'), 'Blocked');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Blocked',
    });
    expect(screen.getByLabelText('Project Name')).toHaveValue('');
    expect(screen.getByLabelText('Owner Name')).toHaveValue('');
  });

  it('should display an API error message when submission fails', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockRejectedValue(new Error('Project name Atlas Migration is already taken'));

    render(<CreateProjectForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Project Name'), 'Atlas Migration');
    await user.type(screen.getByLabelText('Owner Name'), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText('Status'), 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Project name Atlas Migration is already taken'
    );
  });
});
