/**
 * Custom hooks for managing user stats
 */

import { useCallback } from 'react';
import { MoodState } from '../types';
import { useAppState, useAppDispatch } from '../context/AppContext';

export function useStats() {
  const { stats } = useAppState();
  const dispatch = useAppDispatch();

  const updateEnergy = useCallback(
    (change: number) => {
      dispatch({
        type: 'SET_ENERGY',
        payload: stats.energy + change,
      });
    },
    [dispatch, stats.energy]
  );

  const setEnergy = useCallback(
    (energy: number) => {
      dispatch({ type: 'SET_ENERGY', payload: energy });
    },
    [dispatch]
  );

  const updateFood = useCallback(
    (change: number) => {
      dispatch({
        type: 'SET_FOOD',
        payload: stats.food + change,
      });
    },
    [dispatch, stats.food]
  );

  const setFood = useCallback(
    (food: number) => {
      dispatch({ type: 'SET_FOOD', payload: food });
    },
    [dispatch]
  );

  const setMood = useCallback(
    (mood: MoodState) => {
      dispatch({ type: 'SET_MOOD', payload: mood });
    },
    [dispatch]
  );

  return {
    stats,
    updateEnergy,
    setEnergy,
    updateFood,
    setFood,
    setMood,
  };
}
