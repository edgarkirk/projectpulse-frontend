import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './components/Button';
import { DataTable } from './components/DataTable';
import { Input } from './components/Input';
import { KpiCard } from './components/KpiCard';
import { Select } from './components/Select';
import { Sidebar } from './components/Sidebar';
import { StatusTag } from './components/StatusTag';
import { TopBar } from './components/TopBar';
import type { ProjectStatus } from './types/project';

describe('Button', () => {
  it('should render the provided button text', () => {
    render(<Button>Save Project</Button>);

    expect(screen.getByRole('button', { name: /save project/i })).toBeInTheDocument();
  });

  it('should call onClick when the button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Save Project</Button>);

    await user.click(screen.getByRole('button', { name: /save project/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should stay disabled and ignore clicks when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button disabled onClick={handleClick}>
        Save Project
      </Button>
    );

    const button = screen.getByRole('button', { name: /save project/i });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('Input', () => {
  it('should render a labelled text input', () => {
    render(<Input label='Project Name' value='' onChange={jest.fn()} />);

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
  });

  it('should call onChange when the user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input label='Project Name' value='' onChange={handleChange} />);

    await user.type(screen.getByLabelText(/project name/i), 'Atlas Migration');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should prevent typing when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input label='Project Name' value='' onChange={handleChange} disabled />);

    const input = screen.getByLabelText(/project name/i);

    expect(input).toBeDisabled();

    await user.type(input, 'Atlas Migration');

    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('Select', () => {
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'At Risk', label: 'At Risk' },
  ];

  it('should render all select options', () => {
    render(<Select label='Status' value='Active' options={options} onChange={jest.fn()} />);

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /at risk/i })).toBeInTheDocument();
  });

  it('should call onChange when the selected option changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Select label='Status' value='Active' options={options} onChange={handleChange} />);

    await user.selectOptions(screen.getByLabelText(/status/i), 'At Risk');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should prevent changes when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Select label='Status' value='Active' options={options} onChange={handleChange} disabled />);

    const select = screen.getByLabelText(/status/i);

    expect(select).toBeDisabled();

    await user.selectOptions(select, 'At Risk');

    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('StatusTag', () => {
  const statusTones: Array<[ProjectStatus, 'success' | 'warning' | 'error' | 'info']> = [
    ['Active', 'success'],
    ['At Risk', 'warning'],
    ['Blocked', 'error'],
    ['On Hold', 'info'],
  ];

  it.each(statusTones)('should render a %s badge with %s tone', (status, tone) => {
    render(<StatusTag status={status} />);

    const badge = screen.getByRole('status');

    expect(badge).toHaveTextContent(status);
    expect(badge).toHaveAttribute('data-tone', tone);
  });
});

describe('KpiCard', () => {
  it('should render the KPI label and numeric value', () => {
    render(<KpiCard label='Total Projects' value={6} />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should render zero values clearly', () => {
    render(<KpiCard label='On Hold' value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

describe('DataTable', () => {
  it('should render table headers and rows', () => {
    render(
      <DataTable
        headers={['Name', 'Owner', 'Status']}
        rows={[
          ['Atlas Migration', 'Jane Doe', 'Active'],
          ['North Star', 'Sam Lee', 'Blocked'],
        ]}
      />
    );

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByText('Atlas Migration')).toBeInTheDocument();
    expect(screen.getByText('North Star')).toBeInTheDocument();
  });

  it('should render the empty state message when there are no rows', () => {
    render(<DataTable headers={['Name']} rows={[]} emptyMessage='No projects found' />);

    expect(screen.getByText('No projects found')).toBeInTheDocument();
  });
});

describe('TopBar', () => {
  it('should always display the application name ProjectPulse', () => {
    render(<TopBar />);

    expect(screen.getByText('ProjectPulse')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('should render dashboard and projects navigation items', () => {
    render(<Sidebar activeRoute='#/dashboard' onNavigate={jest.fn()} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('should call onNavigate with the projects route when clicked', async () => {
    const user = userEvent.setup();
    const handleNavigate = jest.fn();

    render(<Sidebar activeRoute='#/dashboard' onNavigate={handleNavigate} />);

    await user.click(screen.getByRole('link', { name: /projects/i }));

    expect(handleNavigate).toHaveBeenCalledWith('#/projects');
  });

  it('should visually mark the dashboard route when it is active', () => {
    render(<Sidebar activeRoute='#/dashboard' onNavigate={jest.fn()} />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /projects/i })).not.toHaveAttribute('aria-current', 'page');
  });

  it('should visually mark the projects route when it is active', () => {
    render(<Sidebar activeRoute='#/projects' onNavigate={jest.fn()} />);

    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current', 'page');
  });
});
