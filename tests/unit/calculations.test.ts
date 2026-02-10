import { describe, it, expect } from 'vitest';
import {
  calculateEnergyImpact,
  isEnergyBelowGoal,
  clampEnergy,
  getTimeBlocksForDay,
  formatHour,
  getTodayDateString,
  initializeDefaultStats,
} from '../../src/utils/calculations';
import { ExertionLevel, ActivityType, MoodState } from '../../src/types';
import { MAX_ENERGY, MIN_ENERGY, HOURS_PER_DAY } from '../../src/utils/constants';

describe('calculateEnergyImpact', () => {
  it('returns negative values for exerting activities', () => {
    expect(calculateEnergyImpact(ExertionLevel.VeryLow, ActivityType.Exerting)).toBe(-1);
    expect(calculateEnergyImpact(ExertionLevel.Low, ActivityType.Exerting)).toBe(-5);
    expect(calculateEnergyImpact(ExertionLevel.Moderate, ActivityType.Exerting)).toBe(-10);
    expect(calculateEnergyImpact(ExertionLevel.High, ActivityType.Exerting)).toBe(-15);
    expect(calculateEnergyImpact(ExertionLevel.VeryHigh, ActivityType.Exerting)).toBe(-20);
  });

  it('returns positive values for restorative activities', () => {
    expect(calculateEnergyImpact(ExertionLevel.VeryLow, ActivityType.Restorative)).toBe(1);
    expect(calculateEnergyImpact(ExertionLevel.Low, ActivityType.Restorative)).toBe(5);
    expect(calculateEnergyImpact(ExertionLevel.Moderate, ActivityType.Restorative)).toBe(10);
    expect(calculateEnergyImpact(ExertionLevel.High, ActivityType.Restorative)).toBe(15);
    expect(calculateEnergyImpact(ExertionLevel.VeryHigh, ActivityType.Restorative)).toBe(20);
  });
});

describe('isEnergyBelowGoal', () => {
  it('returns true when energy is below 20', () => {
    expect(isEnergyBelowGoal(19)).toBe(true);
    expect(isEnergyBelowGoal(0)).toBe(true);
    expect(isEnergyBelowGoal(10)).toBe(true);
  });

  it('returns false when energy is at or above 20', () => {
    expect(isEnergyBelowGoal(20)).toBe(false);
    expect(isEnergyBelowGoal(50)).toBe(false);
    expect(isEnergyBelowGoal(100)).toBe(false);
  });
});

describe('clampEnergy', () => {
  it('clamps energy to MAX_ENERGY when above', () => {
    expect(clampEnergy(150)).toBe(MAX_ENERGY);
    expect(clampEnergy(101)).toBe(MAX_ENERGY);
  });

  it('clamps energy to MIN_ENERGY when below', () => {
    expect(clampEnergy(-10)).toBe(MIN_ENERGY);
    expect(clampEnergy(-1)).toBe(MIN_ENERGY);
  });

  it('returns energy as-is when within bounds', () => {
    expect(clampEnergy(50)).toBe(50);
    expect(clampEnergy(0)).toBe(0);
    expect(clampEnergy(100)).toBe(100);
  });
});

describe('getTimeBlocksForDay', () => {
  it('returns 24 time blocks', () => {
    const blocks = getTimeBlocksForDay();
    expect(blocks).toHaveLength(HOURS_PER_DAY);
  });

  it('creates blocks with correct hours', () => {
    const blocks = getTimeBlocksForDay();
    blocks.forEach((block, index) => {
      expect(block.hour).toBe(index);
      expect(block.activity).toBeNull();
    });
  });
});

describe('formatHour', () => {
  it('formats midnight correctly', () => {
    expect(formatHour(0)).toBe('12:00 am');
  });

  it('formats morning hours correctly', () => {
    expect(formatHour(1)).toBe('1:00 am');
    expect(formatHour(6)).toBe('6:00 am');
    expect(formatHour(11)).toBe('11:00 am');
  });

  it('formats noon correctly', () => {
    expect(formatHour(12)).toBe('12:00 pm');
  });

  it('formats afternoon/evening hours correctly', () => {
    expect(formatHour(13)).toBe('1:00 pm');
    expect(formatHour(18)).toBe('6:00 pm');
    expect(formatHour(23)).toBe('11:00 pm');
  });
});

describe('getTodayDateString', () => {
  it('returns a date string in YYYY-MM-DD format', () => {
    const dateString = getTodayDateString();
    expect(dateString).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns today's calendar date when hour >= 5", () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 5) {
      const expected = now.toISOString().split('T')[0];
      expect(getTodayDateString()).toBe(expected);
    } else {
      // If current hour < 5, should return yesterday's date
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const expected = yesterday.toISOString().split('T')[0];
      expect(getTodayDateString()).toBe(expected);
    }
  });
});

describe('initializeDefaultStats', () => {
  it('returns default stats with zero energy', () => {
    const stats = initializeDefaultStats();
    expect(stats.energy).toBe(0);
  });

  it('returns default stats with zero meals and snacks', () => {
    const stats = initializeDefaultStats();
    expect(stats.meals).toBe(0);
    expect(stats.snacks).toBe(0);
  });

  it('returns default stats with neutral mood', () => {
    const stats = initializeDefaultStats();
    expect(stats.mood).toBe(MoodState.Neutral);
  });
});
