/**
 * Custom hook for day navigation
 */

import { useCallback } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { loadFromLocalStorage, STORAGE_KEYS } from '../utils/storage';
import { DailyData } from '../types';
import {
  initializeDefaultStats,
  getTodayDateString,
  parseISODate,
  formatDateToISO,
} from '../utils/calculations';

export function useDayNavigation() {
  const { currentDate } = useAppState();
  const dispatch = useAppDispatch();

  const loadDay = useCallback(
    (date: string) => {
      const allData = loadFromLocalStorage<Record<string, DailyData>>(STORAGE_KEYS.DAILY_DATA);

      if (allData?.[date]) {
        const dayData = allData[date];

        // Ensure mood exists (migration from old data)
        const mood =
          dayData.stats?.mood !== undefined ? dayData.stats.mood : initializeDefaultStats().mood;

        // Create DailyData with proper structure
        const dailyDataPayload: DailyData = {
          date: dayData.date || date,
          stats: {
            energy: dayData.stats?.energy || 0,
            meals: dayData.stats?.meals || 0,
            snacks: dayData.stats?.snacks || 0,
            mood,
          },
          activities: dayData.activities || [],
        };

        // Load existing data for this day
        dispatch({ type: 'LOAD_DAY', payload: dailyDataPayload });
      } else {
        // Initialize new day with default stats
        const newDayData: DailyData = {
          date,
          stats: initializeDefaultStats(),
          activities: [],
        };
        dispatch({ type: 'LOAD_DAY', payload: newDayData });
      }
    },
    [dispatch]
  );

  const goToToday = useCallback(() => {
    const today = getTodayDateString();
    loadDay(today);
  }, [loadDay]);

  const goToPreviousDay = useCallback(() => {
    const currentDateObj = parseISODate(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    const previousDate = formatDateToISO(currentDateObj);
    loadDay(previousDate);
  }, [currentDate, loadDay]);

  const goToNextDay = useCallback(() => {
    const currentDateObj = parseISODate(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    const nextDate = formatDateToISO(currentDateObj);
    const today = getTodayDateString();

    // Don't allow navigation beyond today
    if (nextDate <= today) {
      loadDay(nextDate);
    }
  }, [currentDate, loadDay]);

  const goToDate = useCallback(
    (date: string) => {
      const today = getTodayDateString();

      // Don't allow navigation beyond today
      if (date <= today) {
        loadDay(date);
      }
    },
    [loadDay]
  );

  const clearCurrentDay = useCallback(() => {
    dispatch({ type: 'RESET_DAY', payload: currentDate });
  }, [dispatch, currentDate]);

  const isToday = currentDate === getTodayDateString();
  const isFutureDate = currentDate > getTodayDateString();

  return {
    currentDate,
    isToday,
    isFutureDate,
    goToToday,
    goToPreviousDay,
    goToNextDay,
    goToDate,
    clearCurrentDay,
  };
}
