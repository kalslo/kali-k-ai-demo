/**
 * Utility functions for energy, stats, and time calculations
 */

import { ExertionLevel, ActivityType, TimeBlock, UserStats, MoodState } from '../types';
import {
  EXERTION_ENERGY_IMPACT,
  MAX_ENERGY,
  MIN_ENERGY,
  ENERGY_GOAL_THRESHOLD,
  HOURS_PER_DAY,
} from './constants';

/**
 * Calculate the energy impact of an activity based on exertion level and type
 * @param exertionLevel - The exertion level of the activity
 * @param activityType - Whether the activity is exerting or restorative
 * @returns The energy change (negative for exerting, positive for restorative)
 */
export function calculateEnergyImpact(
  exertionLevel: ExertionLevel,
  activityType: ActivityType
): number {
  const baseImpact = EXERTION_ENERGY_IMPACT[exertionLevel];
  return activityType === ActivityType.Exerting ? -baseImpact : baseImpact;
}

/**
 * Check if energy level is below the daily goal
 * @param energy - Current energy level
 * @returns True if energy is below the goal threshold
 */
export function isEnergyBelowGoal(energy: number): boolean {
  return energy < ENERGY_GOAL_THRESHOLD;
}

/**
 * Clamp energy value between min and max
 * @param energy - Energy value to clamp
 * @returns Energy value clamped between MIN_ENERGY and MAX_ENERGY
 */
export function clampEnergy(energy: number): number {
  return Math.max(MIN_ENERGY, Math.min(MAX_ENERGY, energy));
}

/**
 * Calculate total food points from meals and snacks
 * @param meals - Number of meals
 * @param snacks - Number of snacks
 * @returns Total food points
 */
export function calculateFoodPoints(meals: number, snacks: number): number {
  return meals * 30 + snacks * 10;
}

/**
 * Generate an array of time blocks for a full day (0-23 hours)
 * @returns Array of 24 time blocks
 */
export function getTimeBlocksForDay(): TimeBlock[] {
  return Array.from({ length: HOURS_PER_DAY }, (_, hour) => ({
    hour,
    activity: null,
  }));
}

/**
 * Format hour to display string (e.g., 0 -> "12:00 am", 13 -> "1:00 pm")
 * @param hour - Hour of day (0-23)
 * @returns Formatted time string
 */
export function formatHour(hour: number): string {
  const period = hour < 12 ? 'am' : 'pm';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

/**
 * Get current hour (0-23)
 * @returns Current hour
 */
export function getCurrentHour(): number {
  return new Date().getHours();
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * @returns ISO date string
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0] ?? '';
}

/**
 * Initialize default user stats
 * @returns Default UserStats object
 */
export function initializeDefaultStats(): UserStats {
  return {
    energy: MAX_ENERGY,
    food: 0,
    mood: MoodState.Neutral,
  };
}
