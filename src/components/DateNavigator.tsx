import React from 'react';
import { useDayNavigation } from '../hooks/useDayNavigation';
import { Button } from './Button';
import './DateNavigator.css';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const formatDateFull = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export const DateNavigator: React.FC = () => {
  const { currentDate, isToday, isFutureDate, goToToday, goToPreviousDay, goToNextDay } =
    useDayNavigation();

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
    </div>
  );
};
