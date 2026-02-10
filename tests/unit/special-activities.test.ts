import { describe, it, expect } from 'vitest';
import {
  isSleepActivity,
  isFoodActivity,
  calculateSleepEnergy,
  getSleepActivities,
  getFoodActivities,
  calculateTotalSleepEnergy,
  countMealsAndSnacks,
} from '../../src/utils/specialActivities';
import { Activity, ActivityCategory, FoodType, ExertionLevel, ActivityType } from '../../src/types';

describe('specialActivities', () => {
  const baseActivity: Activity = {
    id: '1',
    name: 'Test Activity',
    startTime: 8,
    endTime: 9,
    exertionLevel: ExertionLevel.Moderate,
    type: ActivityType.Exerting,
    date: '2026-02-09',
  };

  describe('isSleepActivity', () => {
    it('returns true for sleep activities', () => {
      const sleepActivity: Activity = {
        ...baseActivity,
        category: ActivityCategory.Sleep,
      };
      expect(isSleepActivity(sleepActivity)).toBe(true);
    });

    it('returns false for non-sleep activities', () => {
      expect(isSleepActivity(baseActivity)).toBe(false);
    });

    it('returns false for food activities', () => {
      const foodActivity: Activity = {
        ...baseActivity,
        category: ActivityCategory.Food,
      };
      expect(isFoodActivity(foodActivity)).toBe(true);
      expect(isSleepActivity(foodActivity)).toBe(false);
    });
  });

  describe('isFoodActivity', () => {
    it('returns true for food activities', () => {
      const foodActivity: Activity = {
        ...baseActivity,
        category: ActivityCategory.Food,
        foodType: FoodType.Meal,
      };
      expect(isFoodActivity(foodActivity)).toBe(true);
    });

    it('returns false for non-food activities', () => {
      expect(isFoodActivity(baseActivity)).toBe(false);
    });
  });

  describe('calculateSleepEnergy', () => {
    it('calculates energy for 1-hour sleep', () => {
      const onehourSleep: Activity = {
        ...baseActivity,
        startTime: 23,
        endTime: 24,
        category: ActivityCategory.Sleep,
      };
      expect(calculateSleepEnergy(onehourSleep)).toBe(12.5);
    });

    it('calculates energy for 8-hour sleep', () => {
      const properSleep: Activity = {
        ...baseActivity,
        startTime: 0,
        endTime: 8,
        category: ActivityCategory.Sleep,
      };
      expect(calculateSleepEnergy(properSleep)).toBe(100); // 8 * 12.5
    });

    it('returns 0 for non-sleep activities', () => {
      expect(calculateSleepEnergy(baseActivity)).toBe(0);
    });
  });

  describe('getSleepActivities', () => {
    it('filters only sleep activities', () => {
      const activities: Activity[] = [
        { ...baseActivity, id: '1' },
        { ...baseActivity, id: '2', category: ActivityCategory.Sleep },
        { ...baseActivity, id: '3', category: ActivityCategory.Food },
        { ...baseActivity, id: '4', category: ActivityCategory.Sleep },
      ];
      const sleepActivities = getSleepActivities(activities);
      expect(sleepActivities).toHaveLength(2);
      expect(sleepActivities[0]?.id).toBe('2');
      expect(sleepActivities[1]?.id).toBe('4');
    });

    it('returns empty array when no sleep activities', () => {
      const activities: Activity[] = [baseActivity];
      expect(getSleepActivities(activities)).toHaveLength(0);
    });
  });

  describe('getFoodActivities', () => {
    it('filters only food activities', () => {
      const activities: Activity[] = [
        { ...baseActivity, id: '1' },
        { ...baseActivity, id: '2', category: ActivityCategory.Food, foodType: FoodType.Meal },
        { ...baseActivity, id: '3', category: ActivityCategory.Sleep },
        { ...baseActivity, id: '4', category: ActivityCategory.Food, foodType: FoodType.Snack },
      ];
      const foodActivities = getFoodActivities(activities);
      expect(foodActivities).toHaveLength(2);
      expect(foodActivities[0]?.id).toBe('2');
      expect(foodActivities[1]?.id).toBe('4');
    });
  });

  describe('calculateTotalSleepEnergy', () => {
    it('sums energy from multiple sleep activities', () => {
      const activities: Activity[] = [
        {
          ...baseActivity,
          id: '1',
          startTime: 0,
          endTime: 2,
          category: ActivityCategory.Sleep,
        },
        {
          ...baseActivity,
          id: '2',
          startTime: 2,
          endTime: 4,
          category: ActivityCategory.Sleep,
        },
      ];
      const newEnergy = calculateTotalSleepEnergy(activities, 50);
      expect(newEnergy).toBe(100); // 50 + (2*12.5) + (2*12.5) = 50 + 25 + 25 = 100
    });

    it('caps energy at 100', () => {
      const activities: Activity[] = [
        {
          ...baseActivity,
          startTime: 0,
          endTime: 8,
          category: ActivityCategory.Sleep,
        },
      ];
      const newEnergy = calculateTotalSleepEnergy(activities, 50);
      expect(newEnergy).toBe(100); // Capped at max
    });

    it('returns current energy when no sleep activities', () => {
      const activities: Activity[] = [baseActivity];
      expect(calculateTotalSleepEnergy(activities, 75)).toBe(75);
    });
  });

  describe('countMealsAndSnacks', () => {
    it('counts meals and snacks separately', () => {
      const activities: Activity[] = [
        {
          ...baseActivity,
          id: '1',
          category: ActivityCategory.Food,
          foodType: FoodType.Meal,
        },
        {
          ...baseActivity,
          id: '2',
          category: ActivityCategory.Food,
          foodType: FoodType.Meal,
        },
        {
          ...baseActivity,
          id: '3',
          category: ActivityCategory.Food,
          foodType: FoodType.Meal,
        },
        {
          ...baseActivity,
          id: '4',
          category: ActivityCategory.Food,
          foodType: FoodType.Snack,
        },
      ];
      const counts = countMealsAndSnacks(activities);
      expect(counts.meals).toBe(3);
      expect(counts.snacks).toBe(1);
    });

    it('returns zero counts for no food activities', () => {
      const activities: Activity[] = [baseActivity];
      const counts = countMealsAndSnacks(activities);
      expect(counts.meals).toBe(0);
      expect(counts.snacks).toBe(0);
    });
  });
});
