import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { ProjectForm } from './ProjectForm';

describe('ProjectForm', () => {
  it('should render the labeled inputs and select control', () => {
    const handleSubmit = jest.fn();

    render(<ProjectForm onSubmit={handleSubmit} />);

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('should call onSubmit with the entered form values when submitted successfully', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<ProjectForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
    });
  });

  it('should display the API error message when submission fails', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockRejectedValue(new Error('Name is required'));

    render(<ProjectForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required');
  });

  it('should clear the fields after a successful submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockResolvedValue(undefined);

    render(<ProjectForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/project name/i);
    const ownerInput = screen.getByLabelText(/owner name/i);
    const statusSelect = screen.getByLabelText(/status/i);

    await user.type(nameInput, 'Atlas Migration');
    await user.type(ownerInput, 'Jane Doe');
    await user.selectOptions(statusSelect, 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(nameInput).toHaveValue('');
    expect(ownerInput).toHaveValue('');
    expect(statusSelect).toHaveValue('');
  });

  it('should keep the submit button disabled while required fields are empty', () => {
    render(<ProjectForm onSubmit={jest.fn()} />);

    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
  });
});
