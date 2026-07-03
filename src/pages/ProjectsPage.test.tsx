import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import { ProjectsPage } from './ProjectsPage';
import { createProject, fetchProjects } from '../api';
import { buildProject } from '../testSupport';

jest.mock('../api');

describe('ProjectsPage', () => {
  it('should_renderCreateForm_andProjectTable_when_loaded', async () => {
    const projects = [
      buildProject({
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      }),
      buildProject({
        id: '22222222-2222-4222-8222-222222222222',
        name: 'Northwind Refresh',
        ownerName: 'Ada Lovelace',
        status: 'At Risk',
      }),
    ];

    jest.mocked(fetchProjects).mockResolvedValueOnce(projects);

    render(<ProjectsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(fetchProjects).toHaveBeenCalledTimes(1));

    expect(await screen.findByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });

  it('should_showSuccessMessage_andRefreshList_when_createSucceeds', async () => {
    const user = userEvent.setup();
    const initialProjects = [
      buildProject({
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Northwind Refresh',
        ownerName: 'Ada Lovelace',
        status: 'At Risk',
        createdAt: '2026-07-03T10:00:00.000Z',
      }),
    ];
    const createdProject = buildProject({
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Atlas Migration',
      ownerName: 'Jane Doe',
      status: 'Active',
      createdAt: '2026-07-03T11:00:00.000Z',
    });

    jest.mocked(fetchProjects)
      .mockResolvedValueOnce(initialProjects)
      .mockResolvedValueOnce([createdProject, ...initialProjects]);
    jest.mocked(createProject).mockResolvedValueOnce(createdProject);

    render(<ProjectsPage />);

    const nameInput = await screen.findByLabelText(/project name/i);
    const ownerInput = screen.getByLabelText(/owner name/i);
    const statusSelect = screen.getByLabelText(/project status/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Atlas Migration');
    await user.clear(ownerInput);
    await user.type(ownerInput, 'Jane Doe');
    await user.selectOptions(statusSelect, 'Active');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() =>
      expect(createProject).toHaveBeenCalledWith({
        name: 'Atlas Migration',
        ownerName: 'Jane Doe',
        status: 'Active',
      })
    );

    expect(await screen.findByRole('status')).toHaveTextContent(
      "Project 'Atlas Migration' created successfully"
    );
    expect(screen.getByRole('cell', { name: /atlas migration/i })).toBeInTheDocument();
  });

  it('should_showValidationErrorMessage_verbatim_when_createReturns400', async () => {
    const user = userEvent.setup();

    jest.mocked(fetchProjects).mockResolvedValueOnce([]);
    jest.mocked(createProject).mockRejectedValueOnce(new Error('name is required'));

    render(<ProjectsPage />);

    const nameInput = await screen.findByLabelText(/project name/i);
    const ownerInput = screen.getByLabelText(/owner name/i);

    await user.type(ownerInput, 'Jane Doe');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('name is required');
    expect(nameInput).toHaveValue('');
  });

  it('should_showDuplicateNameErrorMessage_verbatim_when_createReturns409', async () => {
    const user = userEvent.setup();

    jest.mocked(fetchProjects).mockResolvedValueOnce([]);
    jest.mocked(createProject).mockRejectedValueOnce(
      new Error('Project name Atlas Migration is already taken')
    );

    render(<ProjectsPage />);

    const nameInput = await screen.findByLabelText(/project name/i);
    const ownerInput = screen.getByLabelText(/owner name/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Atlas Migration');
    await user.type(ownerInput, 'Jane Doe');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Project name Atlas Migration is already taken'
    );
    expect(nameInput).toHaveValue('Atlas Migration');
  });
});
