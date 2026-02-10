/**
 * Local storage utility functions for persisting data
 */

const STORAGE_KEYS = {
  DAILY_DATA: 'window_daily_data',
  APP_VERSION: 'window_app_version',
} as const;

const APP_VERSION = '1.0.0';

/**
 * Save data to localStorage
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load data from localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current app version
 */
export function getAppVersion(): string {
  return loadFromLocalStorage<string>(STORAGE_KEYS.APP_VERSION) ?? APP_VERSION;
}

/**
 * Set the app version
 */
export function setAppVersion(): void {
  saveToLocalStorage(STORAGE_KEYS.APP_VERSION, APP_VERSION);
}

export { STORAGE_KEYS, APP_VERSION };
