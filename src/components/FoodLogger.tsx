import React, { useState } from 'react';
import { FoodType } from '../types';
import { Button } from './Button';
import './FoodLogger.css';

interface FoodLoggerProps {
  onAddMeal: (name: string, hour: number) => void;
  onAddSnack: (name: string, hour: number) => void;
  onCancel: () => void;
}

export const FoodLogger: React.FC<FoodLoggerProps> = ({ onAddMeal, onAddSnack, onCancel }) => {
  const [name, setName] = useState('');
  const [hour, setHour] = useState(new Date().getHours());
  const [foodType, setFoodType] = useState<FoodType>(FoodType.Meal);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    if (foodType === FoodType.Meal) {
      onAddMeal(name.trim(), hour);
    } else {
      onAddSnack(name.trim(), hour);
    }

    // Reset form
    setName('');
    setError('');
  };

  return (
    <form className="food-logger" onSubmit={handleSubmit}>
      <div className="food-logger__body">
        <div className="food-logger__type-selector">
          <button
            type="button"
            className={`food-logger__type-button ${
              foodType === FoodType.Meal ? 'food-logger__type-button--active' : ''
            }`}
            onClick={() => setFoodType(FoodType.Meal)}
            aria-pressed={foodType === FoodType.Meal}
          >
            <span className="food-logger__type-name">meal</span>
          </button>
          <button
            type="button"
            className={`food-logger__type-button ${
              foodType === FoodType.Snack ? 'food-logger__type-button--active' : ''
            }`}
            onClick={() => setFoodType(FoodType.Snack)}
            aria-pressed={foodType === FoodType.Snack}
          >
            <span className="food-logger__type-name">snack</span>
          </button>
        </div>

        <div className="food-logger__field">
          <label htmlFor="food-name" className="food-logger__label">
            what did you eat?
          </label>
          <input
            type="text"
            id="food-name"
            className={`food-logger__input ${error ? 'food-logger__input--error' : ''}`}
            value={name}
            onChange={e => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g., breakfast, apple"
          />
          {error && <span className="food-logger__error">{error}</span>}
        </div>

        <div className="food-logger__field">
          <label htmlFor="food-hour" className="food-logger__label">
            time
          </label>
          <select
            id="food-hour"
            className="food-logger__select"
            value={hour}
            onChange={e => setHour(Number(e.target.value))}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="food-logger__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          cancel
        </Button>
        <Button type="submit" variant="primary">
          log {foodType}
        </Button>
      </div>
    </form>
  );
};
