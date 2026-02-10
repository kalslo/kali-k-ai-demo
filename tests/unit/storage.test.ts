import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  clearAllData,
  isLocalStorageAvailable,
} from '../../src/utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('saveToLocalStorage', () => {
    it('saves data to localStorage', () => {
      const data = { name: 'Test', value: 123 };
      saveToLocalStorage('test-key', data);

      const saved = localStorage.getItem('test-key');
      expect(saved).toBe(JSON.stringify(data));
    });

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const badData = { circular: {} };
      badData.circular = badData; // Create circular reference

      saveToLocalStorage('test-key', badData);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('loadFromLocalStorage', () => {
    it('loads data from localStorage', () => {
      const data = { name: 'Test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(data));

      const loaded = loadFromLocalStorage<typeof data>('test-key');
      expect(loaded).toEqual(data);
    });

    it('returns null for non-existent keys', () => {
      const loaded = loadFromLocalStorage('non-existent');
      expect(loaded).toBeNull();
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('test-key', 'invalid json');

      const loaded = loadFromLocalStorage('test-key');
      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('removeFromLocalStorage', () => {
    it('removes data from localStorage', () => {
      localStorage.setItem('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('test-value');

      removeFromLocalStorage('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('clearAllData', () => {
    it('clears all app data', () => {
      saveToLocalStorage('window_daily_data', { test: 'data' });
      saveToLocalStorage('window_app_version', '1.0.0');

      expect(localStorage.getItem('window_daily_data')).not.toBeNull();
      expect(localStorage.getItem('window_app_version')).not.toBeNull();

      clearAllData();

      expect(localStorage.getItem('window_daily_data')).toBeNull();
      expect(localStorage.getItem('window_app_version')).toBeNull();
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });
  });
});
