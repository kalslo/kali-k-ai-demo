/**
 * Utility functions for calculating user stats from activities
 */

import { Activity, UserStats, MoodState } from '../types';
import { MAX_ENERGY, MIN_ENERGY } from './constants';
import {
  isSleepActivity,
  isFoodActivity,
  calculateSleepEnergy,
  countMealsAndSnacks,
} from './specialActivities';
import { calculateEnergyImpact } from './calculations';

/**
 * Calculate stats from scratch based on all activities
 * @param activities - All activities for the day
 * @param baseMood - The mood to use (not calculated from activities)
 * @returns Calculated UserStats
 */
export function calculateStatsFromActivities(
  activities: Activity[],
  baseMood: MoodState = MoodState.Neutral
): UserStats {
  // Start with zero energy - build energy through activities (especially sleep)
  let energy = MIN_ENERGY;

  // Count meals and snacks from activities
  const { meals, snacks } = countMealsAndSnacks(activities);

  activities.forEach(activity => {
    if (isSleepActivity(activity)) {
      // Sleep activities restore energy
      const energyGained = calculateSleepEnergy(activity);
      // Guard against NaN
      if (!isNaN(energyGained)) {
        energy += energyGained;
      }
    } else if (!isFoodActivity(activity)) {
      // Regular activities affect energy based on exertion level
      // (Food activities don't affect energy)
      const hourCount = activity.endTime - activity.startTime;
      // Guard against invalid time values
      if (!isNaN(hourCount) && isFinite(hourCount)) {
        const energyPerHour = calculateEnergyImpact(activity.exertionLevel, activity.type);
        const totalEnergyImpact = energyPerHour * hourCount;
        // Guard against NaN
        if (!isNaN(totalEnergyImpact) && isFinite(totalEnergyImpact)) {
          energy += totalEnergyImpact;
        }
      }
    }
  });

  // Clamp energy to valid range (0-100)
  // Energy starts at 0 and is built up through activities (especially sleep).
  // If activities would push energy above 100, it stays at 100.
  // For example: 8hrs sleep (100) - 8hrs work (80) = 20 energy
  // Or: 8hrs sleep (100) + meditation (10) = 100, capped to 100
  energy = Math.max(MIN_ENERGY, Math.min(MAX_ENERGY, energy));

  // Final guard against NaN - if energy is NaN, reset to 0
  if (isNaN(energy)) {
    energy = MIN_ENERGY;
  }

  return {
    energy,
    meals,
    snacks,
    mood: baseMood,
  };
}
