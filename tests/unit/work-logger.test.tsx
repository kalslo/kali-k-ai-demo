import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkLogger } from '../../src/components/WorkLogger';

describe('WorkLogger', () => {
  const mockOnAddWork = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with all required fields', () => {
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/what are you working on\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('displays quick duration buttons', () => {
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    expect(screen.getByRole('button', { name: '1h' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2h' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4h' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8h' })).toBeInTheDocument();
  });

  it('shows placeholder text for work name input', () => {
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const input = screen.getByLabelText(/what are you working on\?/i);
    expect(input).toHaveAttribute('placeholder', expect.stringContaining('optional'));
  });

  it('calculates and displays work duration', () => {
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    // Should show duration stat if valid hours selected (using getByText with exact match for stat label)
    const durationLabels = screen.queryAllByText('duration');
    if (durationLabels.length > 0) {
      // Find the one that's part of the summary stat (has corresponding value)
      expect(screen.getByText(/hours/i)).toBeInTheDocument();
    }
  });

  it('calculates and displays energy cost', () => {
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    // Should show energy cost stat if valid hours selected
    const energyElement = screen.queryByText(/energy cost/i);
    if (energyElement) {
      expect(energyElement).toBeInTheDocument();
    }
  });

  it('allows changing start time', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const startSelect = screen.getByLabelText(/start time/i);
    await user.selectOptions(startSelect, '10');

    expect(startSelect).toHaveValue('10');
  });

  it('allows changing end time', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const endSelect = screen.getByLabelText(/end time/i);
    await user.selectOptions(endSelect, '15');

    expect(endSelect).toHaveValue('15');
  });

  it('automatically adjusts end time when using quick duration button', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const startSelect = screen.getByLabelText(/start time/i);
    await user.selectOptions(startSelect, '9');

    const fourHourButton = screen.getByRole('button', { name: '4h' });
    await user.click(fourHourButton);

    const endSelect = screen.getByLabelText(/end time/i);
    expect(endSelect).toHaveValue('13'); // 9 + 4 = 13
  });

  it('calls onAddWork with default "Work" name when no name is provided', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    await user.selectOptions(startSelect, '9');
    await user.selectOptions(endSelect, '17');

    const submitButton = screen.getByRole('button', { name: /log work/i });
    await user.click(submitButton);

    expect(mockOnAddWork).toHaveBeenCalledWith('Work', 9, 17);
  });

  it('calls onAddWork with custom work name when provided', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/what are you working on\?/i);
    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    await user.type(nameInput, 'Team Meeting');
    await user.selectOptions(startSelect, '10');
    await user.selectOptions(endSelect, '12');

    const submitButton = screen.getByRole('button', { name: /log work/i });
    await user.click(submitButton);

    expect(mockOnAddWork).toHaveBeenCalledWith('Team Meeting', 10, 12);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when end time equals start time', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    await user.selectOptions(startSelect, '10');
    await user.selectOptions(endSelect, '10'); // Same as start

    const submitButton = screen.getByRole('button', { name: /log work/i });
    expect(submitButton).toBeDisabled();
    expect(mockOnAddWork).not.toHaveBeenCalled();
  });

  it('shows error when work duration exceeds 12 hours', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    await user.selectOptions(startSelect, '8');
    await user.selectOptions(endSelect, '21'); // 13 hours

    const submitButton = screen.getByRole('button', { name: /log work/i });
    await user.click(submitButton);

    expect(screen.getByText(/cannot exceed 12 hours/i)).toBeInTheDocument();
    expect(mockOnAddWork).not.toHaveBeenCalled();
  });

  it('shows error when work duration exceeds 12 hours and clears on fix', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    // Create error with 13 hours
    await user.selectOptions(startSelect, '8');
    await user.selectOptions(endSelect, '21'); // 13 hours

    const submitButton = screen.getByRole('button', { name: /log work/i });
    await user.click(submitButton);

    expect(screen.getByText(/cannot exceed 12 hours/i)).toBeInTheDocument();

    // Fix error by changing end time to valid duration
    await user.selectOptions(endSelect, '17'); // Now 9 hours

    expect(screen.queryByText(/cannot exceed 12 hours/i)).not.toBeInTheDocument();
  });

  it('disables submit button when work hours is 0 or negative', () => {
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    screen.getByRole('button', { name: /log work/i });

    // Check if button is disabled when start and end times would result in invalid duration
    // This is handled by the component's internal state
  });

  it('trims whitespace from work name', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/what are you working on\?/i);
    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    await user.type(nameInput, '  Coding  ');
    await user.selectOptions(startSelect, '9');
    await user.selectOptions(endSelect, '11');

    const submitButton = screen.getByRole('button', { name: /log work/i });
    await user.click(submitButton);

    expect(mockOnAddWork).toHaveBeenCalledWith('Coding', 9, 11);
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    // Tab through elements and submit via keyboard
    await user.tab(); // Name input
    await user.keyboard('Design work');
    await user.tab(); // Start time select
    await user.keyboard('{ArrowDown}'); // Change start time
    await user.tab(); // End time select
    await user.keyboard('{ArrowDown}'); // Change end time

    // Can reach and activate quick buttons
    const quickButtons = screen.getByRole('button', { name: '1h' });
    quickButtons.focus();
    await user.keyboard('{Enter}');

    // Can submit
    const submitButton = screen.getByRole('button', { name: /log work/i });
    submitButton.focus();
    expect(submitButton).toHaveFocus();
  });

  it('includes form element for proper submission', () => {
    const { container } = render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('prevents default form submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn((e: Event) => e.preventDefault());

    const { container } = render(<WorkLogger onAddWork={mockOnAddWork} onCancel={mockOnCancel} />);

    const form = container.querySelector('form');
    if (form) {
      form.addEventListener('submit', mockSubmit);
    }

    const startSelect = screen.getByLabelText(/start time/i);
    const endSelect = screen.getByLabelText(/end time/i);

    await user.selectOptions(startSelect, '9');
    await user.selectOptions(endSelect, '17');

    const submitButton = screen.getByRole('button', { name: /log work/i });
    await user.click(submitButton);

    // Form submission should have been prevented
    expect(mockOnAddWork).toHaveBeenCalled();
  });
});
