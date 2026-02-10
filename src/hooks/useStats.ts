/**
 * Custom hooks for managing user stats
 */

import { useCallback } from 'react';
import { MoodState } from '../types';
import { useAppState, useAppDispatch } from '../context/AppContext';

export function useStats() {
  const { stats } = useAppState();
  const dispatch = useAppDispatch();

  const setMood = useCallback(
    (mood: MoodState) => {
      dispatch({ type: 'SET_MOOD', payload: mood });
    },
    [dispatch]
  );

  return {
    stats,
    setMood,
  };
}
