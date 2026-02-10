import React from 'react';
import './FoodTracker.css';

interface FoodTrackerProps {
  meals: number;
  snacks: number;
}

const MEAL_GOAL = 3;
const SNACK_GOAL = 1;

export const FoodTracker: React.FC<FoodTrackerProps> = ({ meals, snacks }) => {
  return (
    <div className="food-tracker" role="region" aria-label="food tracker">
      <div className="food-tracker__header">
        <span className="food-tracker__label">food</span>
        <span className="food-tracker__summary">
          {meals} {meals === 1 ? 'meal' : 'meals'} · {snacks} {snacks === 1 ? 'snack' : 'snacks'}
        </span>
      </div>

      <div className="food-tracker__indicators">
        <div className="food-tracker__meals">
          {Array.from({ length: MEAL_GOAL }).map((_, index) => (
            <div
              key={`meal-${index}`}
              className={`food-tracker__meal-indicator ${
                index < meals ? 'food-tracker__meal-indicator--completed' : ''
              }`}
              aria-label={`Meal ${index + 1} ${index < meals ? 'completed' : 'not completed'}`}
            />
          ))}
        </div>

        <div className="food-tracker__snacks">
          <div
            className={`food-tracker__snack-indicator ${
              snacks >= SNACK_GOAL ? 'food-tracker__snack-indicator--completed' : ''
            }`}
            aria-label={`Snack ${snacks >= SNACK_GOAL ? 'completed' : 'not completed'}`}
          />
        </div>
      </div>
    </div>
  );
};
