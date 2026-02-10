/**
 * Custom hooks for managing activities
 */

import { useCallback } from 'react';
import { Activity, ExertionLevel, ActivityType, ActivityCategory, FoodType } from '../types';
import { useAppState, useAppDispatch } from '../context/AppContext';

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
      return activity;
    },
    [dispatch, currentDate]
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
    },
    [activities, dispatch]
  );

  const deleteActivity = useCallback(
    (activityId: string) => {
      dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });
    },
    [dispatch]
  );

  const deleteActivityHour = useCallback(
    (activityId: string, hour: number) => {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const duration = activity.endTime - activity.startTime;

      // If it's a 1-hour activity, delete it entirely
      if (duration <= 1) {
        dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });
        return;
      }

      // If deleting the first hour, update startTime
      if (hour === activity.startTime) {
        const updatedActivity: Activity = {
          ...activity,
          startTime: activity.startTime + 1,
        };
        dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });
        return;
      }

      // If deleting the last hour, update endTime
      if (hour === activity.endTime - 1) {
        const updatedActivity: Activity = {
          ...activity,
          endTime: activity.endTime - 1,
        };
        dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });
        return;
      }

      // If deleting a middle hour, split into two activities
      // First part: from startTime to hour
      const updatedActivity: Activity = {
        ...activity,
        endTime: hour,
      };

      // Second part: from hour + 1 to endTime
      const newActivity: Activity = {
        ...activity,
        id: crypto.randomUUID(),
        startTime: hour + 1,
        endTime: activity.endTime,
      };

      // Update the first part and add the second part
      dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });
      dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    },
    [activities, dispatch]
  );

  const getActivitiesForHour = useCallback(
    (hour: number) => {
      return activities.filter(activity => {
        // Handle activities that span midnight (endTime > 23)
        if (activity.endTime > 23) {
          // Activity wraps around midnight
          // Check if hour is in the range [startTime, 23] OR [0, endTime % 24)
          return hour >= activity.startTime || hour < activity.endTime % 24;
        }
        // Normal case: activity within same day
        return hour >= activity.startTime && hour < activity.endTime;
      });
    },
    [activities]
  );

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    deleteActivityHour,
    getActivitiesForHour,
  };
}
