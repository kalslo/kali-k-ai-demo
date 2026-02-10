/**
 * Application constants
 */

import { ExertionLevel } from '../types';

// Energy constants
export const MAX_ENERGY = 100;
export const MIN_ENERGY = 0;
export const ENERGY_GOAL_THRESHOLD = 20; // Don't dip below this
export const SLEEP_ENERGY_PER_HOUR = 15;

// Food constants
export const MEAL_POINTS = 30;
export const SNACK_POINTS = 10;
export const DAILY_MEAL_GOAL = 3;
export const DAILY_SNACK_GOAL = 1;

// Time constants
export const HOURS_PER_DAY = 24;
export const MIDNIGHT_HOUR = 0;

// Exertion level energy impact mapping
export const EXERTION_ENERGY_IMPACT: Record<ExertionLevel, number> = {
  [ExertionLevel.VeryLow]: 1,
  [ExertionLevel.Low]: 5,
  [ExertionLevel.Moderate]: 10,
  [ExertionLevel.High]: 15,
  [ExertionLevel.VeryHigh]: 20,
};
