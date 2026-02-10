import { describe, it, expect } from 'vitest';
import { calculateStatsFromActivities } from '../../src/utils/statsCalculation';
import {
  Activity,
  ActivityCategory,
  FoodType,
  ExertionLevel,
  ActivityType,
  MoodState,
} from '../../src/types';

describe('calculateStatsFromActivities', () => {
  const baseActivity: Activity = {
    id: '1',
    name: 'Test Activity',
    startTime: 8,
    endTime: 9,
    exertionLevel: ExertionLevel.Moderate,
    type: ActivityType.Exerting,
    date: '2026-02-09',
  };

  it('calculates energy from sleep activities', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'sleep-1',
        name: 'Sleep',
        startTime: 0,
        endTime: 8,
        category: ActivityCategory.Sleep,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.energy).toBe(100); // 100 (start) + 100 (8h*12.5) = 200, capped at 100
    expect(stats.meals).toBe(0);
    expect(stats.snacks).toBe(0);
  });

  it('calculates food points from meal activities', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'meal-1',
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      },
      {
        ...baseActivity,
        id: 'meal-2',
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.energy).toBe(0); // 0 (start), food doesn't affect energy
    expect(stats.meals).toBe(2);
    expect(stats.snacks).toBe(0);
  });

  it('calculates energy impact from regular activities', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'work-1',
        startTime: 9,
        endTime: 12, // 3 hours
        exertionLevel: ExertionLevel.Moderate,
        type: ActivityType.Exerting,
      },
      {
        ...baseActivity,
        id: 'sleep-1',
        startTime: 0,
        endTime: 8,
        category: ActivityCategory.Sleep,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.energy).toBe(70); // 0 (start) + 100 (sleep) - 30 (3h*10) = 70
    expect(stats.meals).toBe(0);
    expect(stats.snacks).toBe(0);
  });

  it('combines multiple activity types correctly', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'sleep-1',
        startTime: 0,
        endTime: 8,
        category: ActivityCategory.Sleep,
      },
      {
        ...baseActivity,
        id: 'meal-1',
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      },
      {
        ...baseActivity,
        id: 'work-1',
        startTime: 9,
        endTime: 17,
        exertionLevel: ExertionLevel.Moderate,
        type: ActivityType.Exerting,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.energy).toBe(20); // 0 (start) + 100 (sleep) - 80 (8h*10) = 20
    expect(stats.meals).toBe(1);
    expect(stats.snacks).toBe(0);
  });

  it('caps energy at 100 maximum', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'sleep-1',
        startTime: 0,
        endTime: 8,
        category: ActivityCategory.Sleep,
      },
      {
        ...baseActivity,
        id: 'rest-1',
        startTime: 14,
        endTime: 16,
        exertionLevel: ExertionLevel.VeryHigh,
        type: ActivityType.Restorative,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.energy).toBe(100); // 100 (start) + 100 (sleep) + 40 (2h*20 rest) = 240, capped at 100
  });

  it('prevents energy from going below 0', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'work-1',
        startTime: 9,
        endTime: 17,
        exertionLevel: ExertionLevel.VeryHigh,
        type: ActivityType.Exerting,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.energy).toBe(0); // 100 (start) - 160 (8h*20) = -60, capped at 0
  });

  it('preserves mood from parameter', () => {
    const activities: Activity[] = [];

    const statsNeutral = calculateStatsFromActivities(activities, MoodState.Neutral);
    expect(statsNeutral.mood).toBe(MoodState.Neutral);

    const statsHappy = calculateStatsFromActivities(activities, MoodState.Happy);
    expect(statsHappy.mood).toBe(MoodState.Happy);
  });

  it('handles empty activities array', () => {
    const stats = calculateStatsFromActivities([]);
    expect(stats.energy).toBe(0); // Start with zero energy
    expect(stats.meals).toBe(0);
    expect(stats.snacks).toBe(0);
    expect(stats.mood).toBe(MoodState.Neutral);
  });

  it('handles mixed meal and snack activities', () => {
    const activities: Activity[] = [
      {
        ...baseActivity,
        id: 'meal-1',
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      },
      {
        ...baseActivity,
        id: 'snack-1',
        category: ActivityCategory.Food,
        foodType: FoodType.Snack,
      },
      {
        ...baseActivity,
        id: 'meal-2',
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      },
    ];

    const stats = calculateStatsFromActivities(activities);
    expect(stats.meals).toBe(2);
    expect(stats.snacks).toBe(1);
  });

  it('caps energy at 100 when activities would exceed limit', () => {
    // Scenario 1: Already at full energy (100), add restorative activity
    // Energy should stay at 100, not increase to 120
    const activitiesAtFull: Activity[] = [
      {
        ...baseActivity,
        id: 'rest-1',
        startTime: 14,
        endTime: 15,
        exertionLevel: ExertionLevel.VeryHigh,
        type: ActivityType.Restorative, // +20 energy
      },
    ];

    const statsAtFull = calculateStatsFromActivities(activitiesAtFull);
    expect(statsAtFull.energy).toBe(20); // 0 (start) + 20 (rest) = 20

    // Scenario 2: With high-energy activities that would exceed 100
    // Create scenario where we end up at 95 energy
    const activitiesNear95: Activity[] = [
      {
        ...baseActivity,
        id: 'work-1',
        startTime: 9,
        endTime: 9.5, // 0.5 hours to lose 5 energy
        exertionLevel: ExertionLevel.Moderate, // -10 per hour = -5 total
        type: ActivityType.Exerting,
      },
      {
        ...baseActivity,
        id: 'rest-1',
        startTime: 15,
        endTime: 15.5, // Add activity that would give +10
        exertionLevel: ExertionLevel.VeryHigh, // +20 per hour = +10 for 0.5h
        type: ActivityType.Restorative,
      },
    ];

    const statsNear95 = calculateStatsFromActivities(activitiesNear95);
    expect(statsNear95.energy).toBe(5); // 0 (start) - 5 + 10 = 5
  });

  it('demonstrates food activities do not affect energy', () => {
    // Food activities are tracked but don't increase or decrease energy
    const activitiesWithFood: Activity[] = [
      {
        ...baseActivity,
        id: 'meal-1',
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      },
    ];

    const statsWithFood = calculateStatsFromActivities(activitiesWithFood);
    expect(statsWithFood.energy).toBe(0); // Food doesn't affect energy, stays at 0
    expect(statsWithFood.meals).toBe(1);
  });
});
