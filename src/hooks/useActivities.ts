/**
 * Custom hooks for managing activities
 */

import { useCallback } from 'react';
import { Activity, ExertionLevel, ActivityType } from '../types';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { calculateEnergyImpact } from '../utils/calculations';
import { useStats } from './useStats';

export function useActivities() {
  const { activities } = useAppState();
  const dispatch = useAppDispatch();
  const { updateEnergy } = useStats();

  const addActivity = useCallback(
    (
      name: string,
      startTime: number,
      endTime: number,
      exertionLevel: ExertionLevel,
      type: ActivityType,
      date: string
    ) => {
      const activity: Activity = {
        id: crypto.randomUUID(),
        name,
        startTime,
        endTime,
        exertionLevel,
        type,
        date,
      };

      dispatch({ type: 'ADD_ACTIVITY', payload: activity });

      // Calculate and apply energy impact
      const hourCount = endTime - startTime + 1;
      const energyPerHour = calculateEnergyImpact(exertionLevel, type);
      const totalEnergyImpact = energyPerHour * hourCount;

      updateEnergy(totalEnergyImpact);

      return activity;
    },
    [dispatch, updateEnergy]
  );

  const updateActivity = useCallback(
    (activity: Activity, oldActivity: Activity) => {
      dispatch({ type: 'UPDATE_ACTIVITY', payload: activity });

      // Reverse old energy impact
      const oldHourCount = oldActivity.endTime - oldActivity.startTime + 1;
      const oldEnergyPerHour = calculateEnergyImpact(oldActivity.exertionLevel, oldActivity.type);
      const oldTotalImpact = oldEnergyPerHour * oldHourCount;

      // Apply new energy impact
      const newHourCount = activity.endTime - activity.startTime + 1;
      const newEnergyPerHour = calculateEnergyImpact(activity.exertionLevel, activity.type);
      const newTotalImpact = newEnergyPerHour * newHourCount;

      // Net change
      const netChange = newTotalImpact - oldTotalImpact;
      updateEnergy(netChange);
    },
    [dispatch, updateEnergy]
  );

  const deleteActivity = useCallback(
    (activityId: string) => {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });

      // Reverse energy impact
      const hourCount = activity.endTime - activity.startTime + 1;
      const energyPerHour = calculateEnergyImpact(activity.exertionLevel, activity.type);
      const totalEnergyImpact = energyPerHour * hourCount;

      updateEnergy(-totalEnergyImpact);
    },
    [activities, dispatch, updateEnergy]
  );

  const getActivitiesForHour = useCallback(
    (hour: number) => {
      return activities.filter(activity => hour >= activity.startTime && hour <= activity.endTime);
    },
    [activities]
  );

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivitiesForHour,
  };
}
