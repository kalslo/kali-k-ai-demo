import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateNavigator } from '../../src/components/DateNavigator';
import { AppProvider } from '../../src/context/AppContext';
import { STORAGE_KEYS } from '../../src/utils/storage';

describe('DateNavigator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithProvider = () => {
    return render(
      <AppProvider>
        <DateNavigator />
      </AppProvider>
    );
  };

  it('renders date navigation controls', () => {
    renderWithProvider();

    expect(screen.getByLabelText(/previous day/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next day/i)).toBeInTheDocument();
    // Note: "go to today" button only appears when NOT on today
  });

  it('renders clear all button', () => {
    renderWithProvider();

    const clearButton = screen.getByRole('button', { name: /clear all activities/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveTextContent(/clear all/i);
  });

  it('shows confirmation dialog when clear all is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const clearButton = screen.getByRole('button', { name: /clear all activities/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/clear all activities\?/i)).toBeInTheDocument();
      expect(screen.getByText(/this cannot be undone/i)).toBeInTheDocument();
    });

    // Should have cancel and confirm buttons
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^clear all$/i })).toBeInTheDocument();
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    // Open dialog
    const clearButton = screen.getByRole('button', { name: /clear all activities/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/clear all activities\?/i)).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /^cancel$/i });
    await user.click(cancelButton);

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText(/clear all activities\?/i)).not.toBeInTheDocument();
    });
  });

  it('clears activities and resets stats when confirmed', async () => {
    const user = userEvent.setup();

    const testDate = '2024-01-15';

    // Set up some mock data in localStorage
    const mockData = {
      [testDate]: {
        date: testDate,
        stats: { energy: 50, meals: 2, snacks: 1, mood: 'happy' as const },
        activities: [
          {
            id: '1',
            date: testDate,
            startTime: 9,
            endTime: 10,
            name: 'Test Activity',
            type: 'activity' as const,
            exertion: 'moderate' as const,
          },
        ],
      },
    };
    localStorage.setItem(STORAGE_KEYS.DAILY_DATA, JSON.stringify(mockData));

    renderWithProvider();

    // Open dialog
    const clearButton = screen.getByRole('button', { name: /clear all activities/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/clear all activities\?/i)).toBeInTheDocument();
    });

    // Get all "clear all" buttons and click the one in the dialog (should be the last one)
    const allClearButtons = screen.getAllByRole('button', { name: /clear all/i });
    const confirmButton = allClearButtons[allClearButtons.length - 1];
    if (!confirmButton) throw new Error('Confirm button not found');
    await user.click(confirmButton);

    // Dialog should close
    await waitFor(
      () => {
        expect(screen.queryByText(/clear all activities\?/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check localStorage was updated - get today's data
    const savedDataStr = localStorage.getItem(STORAGE_KEYS.DAILY_DATA) || '{}';
    interface SavedDayData {
      activities: unknown[];
      stats: { energy: number; meals: number; snacks: number };
    }
    const savedData = JSON.parse(savedDataStr) as Record<string, SavedDayData>;
    const today: string = new Date().toISOString().split('T')[0]!;
    const todayData = savedData[today];

    if (!todayData) throw new Error('Today data not found');

    expect(todayData.activities).toEqual([]);
    expect(todayData.stats.energy).toBe(0); // Reset to default (starts at 0)
    expect(todayData.stats.meals).toBe(0); // Reset to default
    expect(todayData.stats.snacks).toBe(0); // Reset to default
  });
});
