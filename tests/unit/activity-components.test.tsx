import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExertionSelector } from '../../src/components/ExertionSelector';
import { ActivityTypeToggle } from '../../src/components/ActivityTypeToggle';
import { ActivityForm } from '../../src/components/ActivityForm';
import { ExertionLevel, ActivityType } from '../../src/types';

describe('ExertionSelector', () => {
  it('renders with label', () => {
    const onChange = vi.fn();
    render(<ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />);
    expect(screen.getByText(/exertion level/i)).toBeInTheDocument();
  });

  it('displays all exertion levels as options', () => {
    const onChange = vi.fn();
    render(<ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />);

    expect(screen.getByRole('button', { name: /very low -1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /low -5/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /moderate -10/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /high -15/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /very high -20/i })).toBeInTheDocument();
  });

  it('highlights selected exertion level', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ExertionSelector value={ExertionLevel.High} onChange={onChange} />
    );

    const activeButton = container.querySelector('.exertion-selector__button--active');
    expect(activeButton).toHaveTextContent(/high/i);
  });

  it('calls onChange when exertion level is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />);

    const lowButton = screen.getByRole('button', { name: /low -5/i });
    await user.click(lowButton);

    expect(onChange).toHaveBeenCalledWith(ExertionLevel.Low);
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />);

    const veryLowButton = screen.getByRole('button', { name: /very low -1/i });
    veryLowButton.focus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(ExertionLevel.VeryLow);
  });

  it('shows energy cost indicator for each level', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />
    );

    const indicators = container.querySelectorAll('.exertion-selector__cost');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('applies different styles for each exertion level', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />
    );

    expect(container.querySelector('.exertion-selector__button--very-low')).toBeInTheDocument();
    expect(container.querySelector('.exertion-selector__button--low')).toBeInTheDocument();
    expect(container.querySelector('.exertion-selector__button--moderate')).toBeInTheDocument();
    expect(container.querySelector('.exertion-selector__button--high')).toBeInTheDocument();
    expect(container.querySelector('.exertion-selector__button--very-high')).toBeInTheDocument();
  });

  it('has accessible group label', () => {
    const onChange = vi.fn();
    render(<ExertionSelector value={ExertionLevel.Moderate} onChange={onChange} />);
    expect(screen.getByRole('group', { name: /exertion level/i })).toBeInTheDocument();
  });
});

describe('ActivityTypeToggle', () => {
  it('renders with label', () => {
    const onChange = vi.fn();
    render(<ActivityTypeToggle value={ActivityType.Exerting} onChange={onChange} />);
    expect(screen.getByText(/activity type/i)).toBeInTheDocument();
  });

  it('displays both activity type options', () => {
    const onChange = vi.fn();
    render(<ActivityTypeToggle value={ActivityType.Exerting} onChange={onChange} />);

    expect(screen.getByRole('button', { name: /exerting/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restorative/i })).toBeInTheDocument();
  });

  it('highlights selected activity type', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ActivityTypeToggle value={ActivityType.Restorative} onChange={onChange} />
    );

    const activeButton = container.querySelector('.activity-type-toggle__button--active');
    expect(activeButton).toHaveTextContent(/restorative/i);
  });

  it('calls onChange when activity type is toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActivityTypeToggle value={ActivityType.Exerting} onChange={onChange} />);

    const restorativeButton = screen.getByRole('button', { name: /restorative/i });
    await user.click(restorativeButton);

    expect(onChange).toHaveBeenCalledWith(ActivityType.Restorative);
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ActivityTypeToggle value={ActivityType.Exerting} onChange={onChange} />);

    const restorativeButton = screen.getByRole('button', { name: /restorative/i });
    restorativeButton.focus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(ActivityType.Restorative);
  });

  it('shows description for each type', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ActivityTypeToggle value={ActivityType.Exerting} onChange={onChange} />
    );

    const descriptions = container.querySelectorAll('.activity-type-toggle__description');
    expect(descriptions.length).toBe(2);
  });

  it('has accessible group label', () => {
    const onChange = vi.fn();
    render(<ActivityTypeToggle value={ActivityType.Exerting} onChange={onChange} />);
    expect(screen.getByRole('group', { name: /activity type/i })).toBeInTheDocument();
  });
});

describe('ActivityForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders form with all fields', () => {
    render(<ActivityForm hour={8} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/activity name/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /exertion level/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /activity type/i })).toBeInTheDocument();
  });

  it('shows hour in form title', () => {
    render(<ActivityForm hour={14} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText(/14:00/i)).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    render(<ActivityForm hour={8} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in activity name
    const nameInput = screen.getByLabelText(/activity name/i);
    await user.type(nameInput, 'Morning Workout');

    // Select exertion level
    const highButton = screen.getByRole('button', { name: /high -15/i });
    await user.click(highButton);

    // Select activity type
    const exertingButton = screen.getByRole('button', { name: /exerting/i });
    await user.click(exertingButton);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Morning Workout',
      hour: 8,
      exertionLevel: ExertionLevel.High,
      type: ActivityType.Exerting,
    });
  });

  it('validates required activity name', async () => {
    const user = userEvent.setup();
    render(<ActivityForm hour={8} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityForm hour={8} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('prefills form when editing existing activity', () => {
    const existingActivity = {
      id: '1',
      name: 'Existing Activity',
      startTime: 8,
      endTime: 9,
      exertionLevel: ExertionLevel.Moderate,
      type: ActivityType.Restorative,
      date: '2026-02-09',
    };

    render(
      <ActivityForm
        hour={8}
        activity={existingActivity}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/activity name/i);
    expect(nameInput).toHaveValue('Existing Activity');
  });

  it('has accessible form structure', () => {
    render(<ActivityForm hour={8} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Check for form elements
    expect(screen.getByLabelText(/activity name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
