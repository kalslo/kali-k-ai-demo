/**
 * Custom hook for day navigation
 */

import { useCallback } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { loadFromLocalStorage, STORAGE_KEYS } from '../utils/storage';
import { DailyData } from '../types';
import { initializeDefaultStats, getTodayDateString } from '../utils/calculations';

export function useDayNavigation() {
  const { currentDate } = useAppState();
  const dispatch = useAppDispatch();

  const loadDay = useCallback(
    (date: string) => {
      const allData = loadFromLocalStorage<Record<string, DailyData>>(STORAGE_KEYS.DAILY_DATA);

      if (allData?.[date]) {
        // Load existing data for this day
        dispatch({ type: 'LOAD_DAY', payload: allData[date] });
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
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    const previousDate = currentDateObj.toISOString().split('T')[0];
    loadDay(previousDate);
  }, [currentDate, loadDay]);

  const goToNextDay = useCallback(() => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    const nextDate = currentDateObj.toISOString().split('T')[0];
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
  };
}
