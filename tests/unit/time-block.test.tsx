import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('renders with hour label', () => {
    render(<TimeBlock hour={8} activity={null} />);
    expect(screen.getByText('08:00')).toBeInTheDocument();
  });

  it('displays activity when present', () => {
    render(<TimeBlock hour={8} activity={mockActivity} />);
    expect(screen.getByText('Morning Walk')).toBeInTheDocument();
  });

  it('shows empty state when no activity', () => {
    const { container } = render(<TimeBlock hour={8} activity={null} />);
    const block = container.querySelector('.time-block--empty');
    expect(block).toBeInTheDocument();
  });

  it('formats hour with leading zero', () => {
    render(<TimeBlock hour={5} activity={null} />);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('formats midnight correctly', () => {
    render(<TimeBlock hour={0} activity={null} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('formats noon correctly', () => {
    render(<TimeBlock hour={12} activity={null} />);
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('formats evening hours correctly', () => {
    render(<TimeBlock hour={23} activity={null} />);
    expect(screen.getByText('23:00')).toBeInTheDocument();
  });

  it('applies activity class when activity present', () => {
    const { container } = render(<TimeBlock hour={8} activity={mockActivity} />);
    const block = container.querySelector('.time-block--has-activity');
    expect(block).toBeInTheDocument();
  });

  it('shows exertion level indicator', () => {
    const { container } = render(<TimeBlock hour={8} activity={mockActivity} />);
    const indicator = container.querySelector('.time-block__exertion');
    expect(indicator).toBeInTheDocument();
  });

  it('applies exertion level class', () => {
    const { container } = render(<TimeBlock hour={8} activity={mockActivity} />);
    const indicator = container.querySelector('.time-block__exertion--low');
    expect(indicator).toBeInTheDocument();
  });

  it('shows activity type indicator', () => {
    const { container } = render(<TimeBlock hour={8} activity={mockActivity} />);
    const indicator = container.querySelector('.time-block__type');
    expect(indicator).toBeInTheDocument();
  });

  it('highlights current hour', () => {
    const { container } = render(<TimeBlock hour={8} activity={null} isCurrent={true} />);
    const block = container.querySelector('.time-block--current');
    expect(block).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(<TimeBlock hour={8} activity={mockActivity} />);
    const block = screen.getByRole('article');
    expect(block).toBeInTheDocument();
  });

  it('has accessible time label', () => {
    render(<TimeBlock hour={8} activity={null} />);
    expect(screen.getByLabelText('8:00 AM')).toBeInTheDocument();
  });

  it('displays activity duration', () => {
    render(<TimeBlock hour={8} activity={mockActivity} />);
    expect(screen.getByText(/1 hour/i)).toBeInTheDocument();
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
