import React from 'react';
import './FoodTracker.css';

interface FoodTrackerProps {
  foodPoints: number;
}

const MEAL_POINTS = 30;
const SNACK_POINTS = 10;
const MEAL_GOAL = 3;
const SNACK_GOAL = 1;

export const FoodTracker: React.FC<FoodTrackerProps> = ({ foodPoints }) => {
  // Calculate meals and snacks from food points
  const mealsConsumed = Math.floor(foodPoints / MEAL_POINTS);
  const remainingPoints = foodPoints % MEAL_POINTS;
  const snacksConsumed = Math.floor(remainingPoints / SNACK_POINTS);

  return (
    <div className="food-tracker" role="region" aria-label="food tracker">
      <div className="food-tracker__header">
        <span className="food-tracker__label">food</span>
        <span className="food-tracker__summary">
          {mealsConsumed} {mealsConsumed === 1 ? 'meal' : 'meals'} · {snacksConsumed}{' '}
          {snacksConsumed === 1 ? 'snack' : 'snacks'}
        </span>
      </div>

      <div className="food-tracker__indicators">
        <div className="food-tracker__meals">
          {Array.from({ length: MEAL_GOAL }).map((_, index) => (
            <div
              key={`meal-${index}`}
              className={`food-tracker__meal-indicator ${
                index < mealsConsumed ? 'food-tracker__meal-indicator--completed' : ''
              }`}
              aria-label={`Meal ${index + 1} ${index < mealsConsumed ? 'completed' : 'not completed'}`}
            />
          ))}
        </div>

        <div className="food-tracker__snacks">
          <div
            className={`food-tracker__snack-indicator ${
              snacksConsumed >= SNACK_GOAL ? 'food-tracker__snack-indicator--completed' : ''
            }`}
            aria-label={`Snack ${snacksConsumed >= SNACK_GOAL ? 'completed' : 'not completed'}`}
          />
        </div>
      </div>
    </div>
  );
};
