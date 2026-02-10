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
  DAY_START_HOUR,
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
 * Format a Date object to ISO string (YYYY-MM-DD) using local time
 * @param date - Date object to format
 * @returns ISO date string in local timezone
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO date string (YYYY-MM-DD) to Date object in local timezone
 * @param dateString - ISO date string
 * @returns Date object at local midnight
 */
export function parseISODate(dateString: string): Date {
  const parts = dateString.split('-').map(Number);
  const [year, month, day] = parts;
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error('Invalid date string format');
  }
  return new Date(year, month - 1, day);
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * Accounts for day starting at 5 AM - hours 0-4 belong to previous calendar day
 * @returns ISO date string for the current "window day"
 */
export function getTodayDateString(): string {
  const now = new Date();
  const currentHour = now.getHours();

  // If it's between midnight and 4:59 AM, this counts as the previous calendar day
  if (currentHour < DAY_START_HOUR) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateToISO(yesterday);
  }

  return formatDateToISO(now);
}

/**
 * Initialize default user stats
 * @returns Default UserStats object
 */
export function initializeDefaultStats(): UserStats {
  return {
    energy: MIN_ENERGY,
    meals: 0,
    snacks: 0,
    mood: MoodState.Neutral,
  };
}
