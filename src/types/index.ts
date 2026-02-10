/**
 * Core type definitions for the Window application
 */

export enum ExertionLevel {
  VeryLow = 'very-low',
  Low = 'low',
  Moderate = 'moderate',
  High = 'high',
  VeryHigh = 'very-high',
}

export enum ActivityType {
  Exerting = 'exerting',
  Restorative = 'restorative',
}

export enum ActivityCategory {
  General = 'general',
  Sleep = 'sleep',
  Food = 'food',
}

export enum FoodType {
  Meal = 'meal',
  Snack = 'snack',
}

export enum MoodState {
  Sad = 'sad',
  Mad = 'mad',
  Neutral = 'neutral',
  Happy = 'happy',
  VeryHappy = 'very-happy',
}

export interface Activity {
  id: string;
  name: string;
  startTime: number; // Hour of day (0-23)
  endTime: number; // Hour of day (0-23)
  exertionLevel: ExertionLevel;
  type: ActivityType;
  category?: ActivityCategory; // Optional category for special activities
  foodType?: FoodType; // Only for food category activities
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface UserStats {
  energy: number; // 0-100
  food: number; // Points
  mood: MoodState;
}

export interface TimeBlock {
  hour: number; // 0-23
  activity: Activity | null;
}

export interface DailyData {
  date: string; // ISO date string (YYYY-MM-DD)
  stats: UserStats;
  activities: Activity[];
}
