/**
 * Special activity calculation utilities
 */

import { Activity, ActivityCategory, FoodType } from '../types';
import { SLEEP_ENERGY_PER_HOUR, MAX_ENERGY } from './constants';

/**
 * Check if an activity is a sleep activity
 */
export function isSleepActivity(activity: Activity): boolean {
  return activity.category === ActivityCategory.Sleep;
}

/**
 * Check if an activity is a food activity
 */
export function isFoodActivity(activity: Activity): boolean {
  return activity.category === ActivityCategory.Food;
}

/**
 * Calculate energy gained from sleep activity
 * @param activity Sleep activity
 * @returns Energy points gained (capped at MAX_ENERGY)
 */
export function calculateSleepEnergy(activity: Activity): number {
  if (!isSleepActivity(activity)) {
    return 0;
  }

  const hours = activity.endTime - activity.startTime;
  const energyGained = hours * SLEEP_ENERGY_PER_HOUR;

  return energyGained;
}

/**
 * Get all sleep activities from an activity list
 */
export function getSleepActivities(activities: Activity[]): Activity[] {
  return activities.filter(isSleepActivity);
}

/**
 * Get all food activities from an activity list
 */
export function getFoodActivities(activities: Activity[]): Activity[] {
  return activities.filter(isFoodActivity);
}

/**
 * Calculate total energy gained from all sleep activities
 * @param activities List of activities
 * @param currentEnergy Current energy level
 * @returns New energy level (capped at MAX_ENERGY)
 */
export function calculateTotalSleepEnergy(activities: Activity[], currentEnergy: number): number {
  const sleepActivities = getSleepActivities(activities);
  const totalSleepEnergy = sleepActivities.reduce((total, activity) => {
    return total + calculateSleepEnergy(activity);
  }, 0);

  return Math.min(currentEnergy + totalSleepEnergy, MAX_ENERGY);
}

/**
 * Count meals and snacks in activities
 */
export function countMealsAndSnacks(activities: Activity[]): { meals: number; snacks: number } {
  const foodActivities = getFoodActivities(activities);

  return foodActivities.reduce(
    (counts, activity) => {
      if (activity.foodType === FoodType.Meal) {
        counts.meals++;
      } else {
        counts.snacks++;
      }
      return counts;
    },
    { meals: 0, snacks: 0 }
  );
}
