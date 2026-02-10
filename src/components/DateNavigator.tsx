import React, { useState } from 'react';
import { useDayNavigation } from '../hooks/useDayNavigation';
import { Button } from './Button';
import { parseISODate } from '../utils/calculations';
import './DateNavigator.css';

const formatDate = (dateString: string): string => {
  const date = parseISODate(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const formatDateFull = (dateString: string): string => {
  const date = parseISODate(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export const DateNavigator: React.FC = () => {
  const {
    currentDate,
    isToday,
    isFutureDate,
    goToToday,
    goToPreviousDay,
    goToNextDay,
    clearCurrentDay,
  } = useDayNavigation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmClear = () => {
    clearCurrentDay();
    setShowConfirm(false);
  };

  const handleCancelClear = () => {
    setShowConfirm(false);
  };

  return (
    <div className="date-navigator">
      <div className="date-navigator__controls">
        <button
          type="button"
          className="date-navigator__arrow"
          onClick={goToPreviousDay}
          aria-label="Previous day"
        >
          ←
        </button>

        <div className="date-navigator__current">
          <div className="date-navigator__date" title={formatDateFull(currentDate)}>
            {isToday ? 'today' : formatDate(currentDate)}
          </div>
          {!isToday && (
            <Button variant="secondary" size="small" onClick={goToToday}>
              go to today
            </Button>
          )}
        </div>

        <button
          type="button"
          className="date-navigator__arrow"
          onClick={goToNextDay}
          disabled={isToday || isFutureDate}
          aria-label="Next day"
        >
          →
        </button>
      </div>

      <div className="date-navigator__actions">
        <Button
          variant="secondary"
          size="small"
          onClick={handleClearClick}
          aria-label="Clear all activities for this day"
        >
          clear all
        </Button>
      </div>

      {showConfirm && (
        <div className="date-navigator__confirm-overlay">
          <div className="date-navigator__confirm-dialog">
            <h3 className="date-navigator__confirm-title">clear all activities?</h3>
            <p className="date-navigator__confirm-message">
              this will remove all activities for {isToday ? 'today' : formatDate(currentDate)} and
              reset your stats. this cannot be undone.
            </p>
            <div className="date-navigator__confirm-actions">
              <Button variant="secondary" onClick={handleCancelClear}>
                cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmClear}>
                clear all
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
