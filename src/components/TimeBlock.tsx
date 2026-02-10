import React, { useState } from 'react';
import { Activity, ActivityCategory, FoodType } from '../types';
import { ActivityForm, ActivityFormData } from './ActivityForm';
import { useActivities } from '../hooks/useActivities';
import './TimeBlock.css';

interface TimeBlockProps {
  hour: number;
  activity: Activity | null;
  isCurrent?: boolean;
}

const formatHour = (hour: number): string => {
  return `${String(hour).padStart(2, '0')}:00`;
};

const formatHourAccessible = (hour: number): string => {
  const isPM = hour >= 12;
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
};

const getExertionEmoji = (exertionLevel: string): string => {
  const emojiMap: Record<string, string> = {
    'very-low': '🌙',
    low: '🍃',
    moderate: '⚡',
    high: '🔥',
    'very-high': '💪',
  };
  return emojiMap[exertionLevel] || '';
};

const getActivityEmoji = (activity: Activity): string => {
  // Show food emoji for food activities
  if (activity.category === ActivityCategory.Food) {
    return activity.foodType === FoodType.Meal ? '🍽️' : '🍪';
  }
  // Otherwise show exertion emoji
  return getExertionEmoji(activity.exertionLevel);
};

export const TimeBlock: React.FC<TimeBlockProps> = ({ hour, activity, isCurrent = false }) => {
  const [showForm, setShowForm] = useState(false);
  const { addActivity, updateActivity, deleteActivityHour } = useActivities();

  const blockClasses = [
    'time-block',
    activity ? 'time-block--has-activity' : 'time-block--empty',
    isCurrent ? 'time-block--current' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const blockStyle = {};

  const handleClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (data: ActivityFormData) => {
    if (activity) {
      // Update existing activity
      updateActivity(activity.id, {
        name: data.name,
        exertionLevel: data.exertionLevel,
        type: data.type,
      });
    } else {
      // Add new activity
      addActivity({
        name: data.name,
        startTime: data.hour,
        endTime: data.hour + 1,
        exertionLevel: data.exertionLevel,
        type: data.type,
      });
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activity) {
      const duration = activity.endTime - activity.startTime;
      const message =
        duration > 1 ? `Delete this hour from "${activity.name}"?` : `Delete "${activity.name}"?`;

      if (window.confirm(message)) {
        deleteActivityHour(activity.id, hour);
      }
    }
  };

  return (
    <>
      <article className={blockClasses} style={blockStyle} aria-label={formatHourAccessible(hour)}>
        <button
          type="button"
          className="time-block__button"
          onClick={handleClick}
          aria-label={
            activity
              ? `Edit activity: ${activity.name} at ${formatHourAccessible(hour)}`
              : `Add activity at ${formatHourAccessible(hour)}`
          }
        >
          <span className="time-block__time">{formatHour(hour)}</span>
          <div className="time-block__content">
            {activity ? (
              <span className="time-block__activity">{activity.name}</span>
            ) : (
              <span className="time-block__empty">---</span>
            )}
          </div>
        </button>
        {activity && (
          <span className="time-block__emoji" aria-hidden="true">
            {getActivityEmoji(activity)}
          </span>
        )}
        {activity && (
          <button
            type="button"
            className="time-block__delete"
            onClick={handleDelete}
            aria-label={`Delete ${activity.name}`}
          >
            ×
          </button>
        )}
      </article>

      {showForm && (
        <div className="time-block-modal">
          <button
            type="button"
            className="time-block-modal__backdrop"
            onClick={handleFormCancel}
            onKeyDown={e => {
              if (e.key === 'Escape') handleFormCancel();
            }}
            aria-label="Close form"
          />
          <div
            className="time-block-modal__content"
            role="dialog"
            aria-labelledby="activity-form-title"
            aria-modal="true"
          >
            <div className="time-block-modal__header">
              <h2 id="activity-form-title" className="time-block-modal__title">
                {activity ? 'edit activity' : 'add activity'} - {formatHour(hour)}
              </h2>
              <button
                type="button"
                className="time-block-modal__close"
                onClick={handleFormCancel}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <ActivityForm
              hour={hour}
              activity={activity || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </>
  );
};
