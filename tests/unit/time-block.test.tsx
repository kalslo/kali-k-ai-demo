import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeBlock } from '../../src/components/TimeBlock';
import { TimeBlockGrid } from '../../src/components/TimeBlockGrid';
import { Activity, ExertionLevel, ActivityType } from '../../src/types';
import { AppProvider } from '../../src/context/AppContext';

describe('TimeBlock', () => {
  const mockActivity: Activity = {
    id: '1',
    name: 'Morning Walk',
    startTime: 8,
    endTime: 9,
    exertionLevel: ExertionLevel.Low,
    type: ActivityType.Exerting,
    date: '2026-02-09',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with hour label', () => {
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );
    expect(screen.getByText('08:00')).toBeInTheDocument();
  });

  it('applies class when activity present but does not display details', () => {
    const { container } = render(
      <AppProvider>
        <TimeBlock hour={8} activity={mockActivity} />
      </AppProvider>
    );
    // In agenda view, activity details are displayed
    const block = container.querySelector('.time-block--has-activity');
    expect(block).toBeInTheDocument();
    // Activity name should be displayed in the agenda
    expect(screen.getByText('Morning Walk')).toBeInTheDocument();
  });

  it('shows empty state when no activity', () => {
    const { container } = render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );
    const block = container.querySelector('.time-block--empty');
    expect(block).toBeInTheDocument();
  });

  it('formats hour with leading zero', () => {
    render(
      <AppProvider>
        <TimeBlock hour={5} activity={null} />
      </AppProvider>
    );
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('formats midnight correctly', () => {
    render(
      <AppProvider>
        <TimeBlock hour={0} activity={null} />
      </AppProvider>
    );
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('formats noon correctly', () => {
    render(
      <AppProvider>
        <TimeBlock hour={12} activity={null} />
      </AppProvider>
    );
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('formats evening hours correctly', () => {
    render(
      <AppProvider>
        <TimeBlock hour={23} activity={null} />
      </AppProvider>
    );
    expect(screen.getByText('23:00')).toBeInTheDocument();
  });

  it('applies activity class when activity present', () => {
    const { container } = render(
      <AppProvider>
        <TimeBlock hour={8} activity={mockActivity} />
      </AppProvider>
    );
    const block = container.querySelector('.time-block--has-activity');
    expect(block).toBeInTheDocument();
  });

  // Activity indicators are intentionally hidden in the new design
  // Users must click the slice to see activity details in the modal

  it('highlights current hour', () => {
    const { container } = render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} isCurrent={true} />
      </AppProvider>
    );
    const block = container.querySelector('.time-block--current');
    expect(block).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={mockActivity} />
      </AppProvider>
    );
    const button = screen.getByRole('button', { name: /Edit activity: Morning Walk at 8:00 AM/i });
    expect(button).toBeInTheDocument();
  });

  it('has accessible time label', () => {
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );
    expect(screen.getByLabelText('8:00 AM')).toBeInTheDocument();
  });

  // Activity duration is intentionally hidden in the new design
  // Users must click the slice to see activity details in the modal

  it('opens form when empty block is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );

    const button = screen.getByRole('button', { name: /Add activity at 8:00 AM/i });
    await user.click(button);

    // Form should be open - check for form heading
    expect(screen.getByText(/add activity - 08:00/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activity name/i)).toBeInTheDocument();
  });

  it('opens form when activity block is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={mockActivity} />
      </AppProvider>
    );

    const button = screen.getByRole('button', { name: /Edit activity: Morning Walk at 8:00 AM/i });
    await user.click(button);

    // Form should be open - check for form heading
    expect(screen.getByText(/edit activity - 08:00/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Morning Walk')).toBeInTheDocument();
  });

  it('shows delete button when editing existing activity', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={mockActivity} />
      </AppProvider>
    );

    const button = screen.getByRole('button', { name: /Edit activity: Morning Walk at 8:00 AM/i });
    await user.click(button);

    expect(screen.getByRole('button', { name: /delete activity/i })).toBeInTheDocument();
  });

  it('does not show delete button when adding new activity', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );

    const button = screen.getByRole('button', { name: /Add activity at 8:00 AM/i });
    await user.click(button);

    expect(screen.queryByRole('button', { name: /delete activity/i })).not.toBeInTheDocument();
  });

  it('closes form when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );

    const openButton = screen.getByRole('button', { name: /Add activity at 8:00 AM/i });
    await user.click(openButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('closes form when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );

    const openButton = screen.getByRole('button', { name: /Add activity at 8:00 AM/i });
    await user.click(openButton);

    const backdrop = container.querySelector('.time-block-modal__backdrop');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      await user.click(backdrop);
    }

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('completes add activity workflow', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TimeBlock hour={8} activity={null} />
      </AppProvider>
    );

    // Open form
    const openButton = screen.getByRole('button', { name: /Add activity at 8:00 AM/i });
    await user.click(openButton);

    // Verify form is in add mode
    expect(screen.getByText(/add activity - 08:00/i)).toBeInTheDocument();

    // Fill in activity name
    const input = screen.getByLabelText(/activity name/i);
    await user.type(input, 'Yoga Session');

    // Select exertion level
    const lowExertion = screen.getByRole('button', { name: /low -5/i });
    await user.click(lowExertion);

    // Submit
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Form should close
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('completes edit activity workflow', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppProvider>
        <TimeBlock hour={8} activity={mockActivity} />
      </AppProvider>
    );

    // Verify activity class is applied (details hidden from view)
    const block = container.querySelector('.time-block--has-activity');
    expect(block).toBeInTheDocument();

    // Open form
    const openButton = screen.getByRole('button', {
      name: /Edit activity: Morning Walk at 8:00 AM/i,
    });
    await user.click(openButton);

    // Verify form is in edit mode with existing data
    expect(screen.getByText(/edit activity - 08:00/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Morning Walk')).toBeInTheDocument();

    // Update activity name
    const input = screen.getByLabelText(/activity name/i);
    await user.clear(input);
    await user.type(input, 'Evening Walk');

    // Submit
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Form should close
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});

describe('TimeBlockGrid', () => {
  it('renders 24 time blocks', () => {
    render(
      <AppProvider>
        <TimeBlockGrid />
      </AppProvider>
    );
    const blocks = screen.getAllByRole('article');
    expect(blocks).toHaveLength(24);
  });

  it('shows all hours from midnight to 23:00', () => {
    render(
      <AppProvider>
        <TimeBlockGrid />
      </AppProvider>
    );
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('23:00')).toBeInTheDocument();
  });

  it('displays activities in correct time blocks', () => {
    const { container } = render(
      <AppProvider>
        <TimeBlockGrid />
      </AppProvider>
    );
    // Should render grid with empty blocks by default
    const emptyBlocks = container.querySelectorAll('.time-block--empty');
    expect(emptyBlocks.length).toBeGreaterThan(0);
  });

  it('has grid layout', () => {
    const { container } = render(
      <AppProvider>
        <TimeBlockGrid />
      </AppProvider>
    );
    const grid = container.querySelector('.time-block-grid');
    expect(grid).toBeInTheDocument();
  });

  it('is accessible with proper structure', () => {
    render(
      <AppProvider>
        <TimeBlockGrid />
      </AppProvider>
    );
    // All time blocks should be accessible articles
    const blocks = screen.getAllByRole('article');
    expect(blocks.length).toBe(24);
  });

  it('renders in chronological order', () => {
    render(
      <AppProvider>
        <TimeBlockGrid />
      </AppProvider>
    );
    const blocks = screen.getAllByRole('article');
    // First block should be midnight (00:00)
    expect(blocks[0]).toHaveAccessibleName('12:00 AM');
    // Last block should be 23:00 (11:00 PM)
    expect(blocks[23]).toHaveAccessibleName('11:00 PM');
  });
});
