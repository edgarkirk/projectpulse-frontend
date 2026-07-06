import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectForm } from './ProjectForm';

describe('ProjectForm', () => {
  it('should keep the submit button disabled when required fields are empty', () => {
    render(<ProjectForm onSubmit={jest.fn()} />);

    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
  });

  it('should call onSubmit with the form data when the user submits valid values', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockResolvedValue(undefined);

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

  it('should reset the fields after a successful submission', async () => {
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

  it('should display the API error message when submission fails', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockRejectedValue(new Error('Project name already exists'));

    render(<ProjectForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');
    await user.type(screen.getByLabelText(/owner name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/status/i), 'Active');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Project name already exists');
  });

  it('should render the status placeholder as a disabled option when the form loads', () => {
    render(<ProjectForm onSubmit={jest.fn()} />);

    const statusSelect = screen.getByLabelText(/status/i);
    const options = screen.getAllByRole('option');

    expect(statusSelect).toBeInTheDocument();
    expect(options[0]).toBeDisabled();
  });
});
