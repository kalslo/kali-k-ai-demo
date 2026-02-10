import React, { useState } from 'react';
import { Button } from './Button';
import { SleepLogger } from './SleepLogger';
import { FoodLogger } from './FoodLogger';
import { Toast } from './Toast';
import { useActivities } from '../hooks/useActivities';
import { useToast } from '../hooks/useToast';
import { FoodType } from '../types';
import './QuickActions.css';

export const QuickActions: React.FC = () => {
  const [showSleepLogger, setShowSleepLogger] = useState(false);
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  const { addActivity } = useActivities();
  const { toasts, showToast, removeToast } = useToast();

  const handleLogSleep = (bedtime: number, wakeTime: number) => {
    // Add sleep activity spanning from bedtime to wake time
    const duration = wakeTime > bedtime ? wakeTime - bedtime : 24 - bedtime + wakeTime;
    const endTime = bedtime + duration;

    addActivity({
      name: 'Sleep',
      startTime: bedtime,
      endTime: endTime,
      exertionLevel: 0,
      type: 'Restorative',
      category: 'Sleep',
    });

    setShowSleepLogger(false);
    showToast('Sleep logged successfully', 'success');
  };

  const handleAddMeal = (name: string, hour: number) => {
    addActivity({
      name,
      startTime: hour,
      endTime: hour + 1,
      exertionLevel: 0,
      type: 'Restorative',
      category: 'Food',
      foodType: FoodType.Meal,
    });

    setShowFoodLogger(false);
    showToast(`${name} logged as meal (+30 points)`, 'success');
  };

  const handleAddSnack = (name: string, hour: number) => {
    addActivity({
      name,
      startTime: hour,
      endTime: hour + 1,
      exertionLevel: 0,
      type: 'Restorative',
      category: 'Food',
      foodType: FoodType.Snack,
    });

    setShowFoodLogger(false);
    showToast(`${name} logged as snack (+10 points)`, 'success');
  };

  return (
    <>
      <div className="quick-actions">
        <h2 className="quick-actions__title">quick actions</h2>
        <div className="quick-actions__buttons">
          <Button
            variant="primary"
            onClick={() => setShowSleepLogger(true)}
            aria-label="Log sleep hours"
          >
            🌙 log sleep
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowFoodLogger(true)}
            aria-label="Log food intake"
          >
            🍽️ log food
          </Button>
        </div>
      </div>

      {showSleepLogger && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSleepLogger(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setShowSleepLogger(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sleep logger"
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-labelledby="sleep-logger-title"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2 id="sleep-logger-title" className="modal-title">
                log sleep
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowSleepLogger(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <SleepLogger onLogSleep={handleLogSleep} />
          </div>
        </div>
      )}

      {showFoodLogger && (
        <div
          className="modal-backdrop"
          onClick={() => setShowFoodLogger(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setShowFoodLogger(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close food logger"
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-labelledby="food-logger-title"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2 id="food-logger-title" className="modal-title">
                log food
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowFoodLogger(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <FoodLogger onAddMeal={handleAddMeal} onAddSnack={handleAddSnack} />
          </div>

          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};
