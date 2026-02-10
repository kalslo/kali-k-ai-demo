/**
 * Migration utility for localStorage data
 * Converts old data format to new format
 */

import { loadFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from './storage';
import { DailyData, MoodState } from '../types';
import { calculateStatsFromActivities } from './statsCalculation';

/**
 * Migrate localStorage data from old format (food points) to new format (meals/snacks)
 * This should be called once on app initialization
 */
export function migrateLocalStorageData(): void {
  const savedData = loadFromLocalStorage<Record<string, DailyData & { stats?: { food?: number } }>>(
    STORAGE_KEYS.DAILY_DATA
  );

  if (!savedData) return;

  let needsMigration = false;
  const migratedData: Record<string, DailyData> = {};

  Object.keys(savedData).forEach(date => {
    const dayData = savedData[date];

    if (!dayData) return; // Skip if day data is undefined

    // Check if this data needs migration (has old 'food' property)
    if (dayData.stats && 'food' in dayData.stats && !('meals' in dayData.stats)) {
      needsMigration = true;

      // Type for old stats format with food property
      type OldStats = { mood?: MoodState | number; food?: number; energy: number };
      const oldStats = dayData.stats as OldStats;

      // Migrate this day's data - use type assertion for mood since we know it exists
      const mood: MoodState = typeof oldStats.mood === 'string' ? oldStats.mood : MoodState.Neutral;

      // Recalculate stats from activities
      const newStats = calculateStatsFromActivities(dayData.activities || [], mood);

      const migratedEntry: DailyData = {
        date: dayData.date || date,
        stats: newStats,
        activities: dayData.activities || [],
      };
      migratedData[date] = migratedEntry;

      // Safe access to food property
      const oldFoodPoints = oldStats.food ?? 0;
      console.log(
        `Migrated data for ${date}: ${oldFoodPoints} food points -> ${newStats.meals} meals, ${newStats.snacks} snacks`
      );
    } else {
      // Keep existing data as-is - type assertion needed for migration type
      migratedData[date] = dayData as DailyData;
    }
  });

  // Save migrated data back to localStorage
  if (needsMigration) {
    saveToLocalStorage(STORAGE_KEYS.DAILY_DATA, migratedData);
    console.log('✓ localStorage migration complete');
  }
}
