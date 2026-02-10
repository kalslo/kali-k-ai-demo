import React from 'react';
import { Activity, ExertionLevel, ActivityType } from '../types';
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

const getActivityDuration = (activity: Activity): string => {
  const duration = activity.endTime - activity.startTime;
  return duration === 1 ? '1 hour' : `${duration} hours`;
};

const EXERTION_LABELS: Record<ExertionLevel, string> = {
  [ExertionLevel.VeryLow]: 'very low',
  [ExertionLevel.Low]: 'low',
  [ExertionLevel.Moderate]: 'moderate',
  [ExertionLevel.High]: 'high',
  [ExertionLevel.VeryHigh]: 'very high',
};

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.Exerting]: 'exerting',
  [ActivityType.Restorative]: 'restorative',
};

export const TimeBlock: React.FC<TimeBlockProps> = ({ hour, activity, isCurrent = false }) => {
  const blockClasses = [
    'time-block',
    activity ? 'time-block--has-activity' : 'time-block--empty',
    isCurrent ? 'time-block--current' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={blockClasses} aria-label={formatHourAccessible(hour)}>
      <div className="time-block__header">
        <span className="time-block__time">{formatHour(hour)}</span>
        {isCurrent && <span className="time-block__current-badge">now</span>}
      </div>

      {activity ? (
        <div className="time-block__content">
          <div className="time-block__activity-name">{activity.name}</div>
          <div className="time-block__meta">
            <span className="time-block__duration">{getActivityDuration(activity)}</span>
            <div className="time-block__indicators">
              <span
                className={`time-block__exertion time-block__exertion--${activity.exertionLevel}`}
                title={`Exertion: ${EXERTION_LABELS[activity.exertionLevel]}`}
              />
              <span
                className={`time-block__type time-block__type--${activity.type}`}
                title={ACTIVITY_TYPE_LABELS[activity.type]}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="time-block__empty-state">
          <span className="time-block__empty-text">free</span>
        </div>
      )}
    </article>
  );
};
