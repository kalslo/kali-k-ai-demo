import React, { useState } from 'react';
import { Activity } from '../types';
import { ActivityForm, ActivityFormData } from './ActivityForm';
import { Button } from './Button';
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

export const TimeBlock: React.FC<TimeBlockProps> = ({ hour, activity, isCurrent = false }) => {
  const [showForm, setShowForm] = useState(false);
  const { addActivity, updateActivity, deleteActivity } = useActivities();

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

  const handleDelete = () => {
    if (activity && window.confirm(`Delete "${activity.name}"?`)) {
      deleteActivity(activity.id);
      setShowForm(false);
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
      </article>

      {showForm && (
        <div className="time-block-modal">
          <div
            className="time-block-modal__backdrop"
            onClick={handleFormCancel}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Escape') handleFormCancel();
            }}
            aria-label="Close form"
          />
          <div className="time-block-modal__content">
            <ActivityForm
              hour={hour}
              activity={activity || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
            {activity && (
              <div className="time-block-modal__delete">
                <Button variant="secondary" onClick={handleDelete}>
                  delete activity
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
