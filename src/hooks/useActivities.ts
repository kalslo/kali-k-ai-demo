/**
 * Custom hooks for managing activities
 */

import { useCallback } from 'react';
import { Activity, ExertionLevel, ActivityType, ActivityCategory, FoodType } from '../types';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { calculateEnergyImpact } from '../utils/calculations';
import {
  calculateSleepEnergy,
  calculateFoodPoints,
  isSleepActivity,
  isFoodActivity,
} from '../utils/specialActivities';
import { useStats } from './useStats';

interface AddActivityParams {
  name: string;
  startTime: number;
  endTime: number;
  exertionLevel: ExertionLevel;
  type: ActivityType;
  category?: ActivityCategory;
  foodType?: FoodType;
}

interface UpdateActivityParams {
  name: string;
  exertionLevel: ExertionLevel;
  type: ActivityType;
  category?: ActivityCategory;
  foodType?: FoodType;
}

export function useActivities() {
  const { activities, currentDate } = useAppState();
  const dispatch = useAppDispatch();
  const { updateEnergy, updateFood } = useStats();

  const addActivity = useCallback(
    (params: AddActivityParams) => {
      const activity: Activity = {
        id: crypto.randomUUID(),
        name: params.name,
        startTime: params.startTime,
        endTime: params.endTime,
        exertionLevel: params.exertionLevel,
        type: params.type,
        category: params.category,
        foodType: params.foodType,
        date: currentDate,
      };

      dispatch({ type: 'ADD_ACTIVITY', payload: activity });

      // Calculate and apply impacts
      if (isSleepActivity(activity)) {
        // Sleep activities restore energy at +15/hour
        const energyGained = calculateSleepEnergy(activity);
        updateEnergy(energyGained);
      } else if (isFoodActivity(activity)) {
        // Food activities add food points
        const foodPoints = calculateFoodPoints(activity);
        updateFood(foodPoints);
      } else {
        // Regular activities affect energy based on exertion level
        const hourCount = activity.endTime - activity.startTime;
        const energyPerHour = calculateEnergyImpact(activity.exertionLevel, activity.type);
        const totalEnergyImpact = energyPerHour * hourCount;
        updateEnergy(totalEnergyImpact);
      }

      return activity;
    },
    [dispatch, updateEnergy, updateFood, currentDate]
  );

  const updateActivity = useCallback(
    (activityId: string, updates: UpdateActivityParams) => {
      const oldActivity = activities.find(a => a.id === activityId);
      if (!oldActivity) return;

      const updatedActivity: Activity = {
        ...oldActivity,
        ...updates,
      };

      dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });

      // Reverse old impacts
      if (isSleepActivity(oldActivity)) {
        const oldEnergy = calculateSleepEnergy(oldActivity);
        updateEnergy(-oldEnergy);
      } else if (isFoodActivity(oldActivity)) {
        const oldFood = calculateFoodPoints(oldActivity);
        updateFood(-oldFood);
      } else {
        const oldHourCount = oldActivity.endTime - oldActivity.startTime;
        const oldEnergyPerHour = calculateEnergyImpact(oldActivity.exertionLevel, oldActivity.type);
        const oldTotalImpact = oldEnergyPerHour * oldHourCount;
        updateEnergy(-oldTotalImpact);
      }

      // Apply new impacts
      if (isSleepActivity(updatedActivity)) {
        const newEnergy = calculateSleepEnergy(updatedActivity);
        updateEnergy(newEnergy);
      } else if (isFoodActivity(updatedActivity)) {
        const newFood = calculateFoodPoints(updatedActivity);
        updateFood(newFood);
      } else {
        const newHourCount = updatedActivity.endTime - updatedActivity.startTime;
        const newEnergyPerHour = calculateEnergyImpact(
          updatedActivity.exertionLevel,
          updatedActivity.type
        );
        const newTotalImpact = newEnergyPerHour * newHourCount;
        updateEnergy(newTotalImpact);
      }
    },
    [activities, dispatch, updateEnergy, updateFood]
  );

  const deleteActivity = useCallback(
    (activityId: string) => {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });

      // Reverse impacts
      if (isSleepActivity(activity)) {
        const energyGained = calculateSleepEnergy(activity);
        updateEnergy(-energyGained);
      } else if (isFoodActivity(activity)) {
        const foodPoints = calculateFoodPoints(activity);
        updateFood(-foodPoints);
      } else {
        const hourCount = activity.endTime - activity.startTime;
        const energyPerHour = calculateEnergyImpact(activity.exertionLevel, activity.type);
        const totalEnergyImpact = energyPerHour * hourCount;
        updateEnergy(-totalEnergyImpact);
      }
    },
    [activities, dispatch, updateEnergy, updateFood]
  );

  const getActivitiesForHour = useCallback(
    (hour: number) => {
      return activities.filter(activity => hour >= activity.startTime && hour < activity.endTime);
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
