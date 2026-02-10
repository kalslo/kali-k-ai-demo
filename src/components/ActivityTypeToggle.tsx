import React from 'react';
import { ActivityType } from '../types';
import './ActivityTypeToggle.css';

interface ActivityTypeToggleProps {
  value: ActivityType;
  onChange: (type: ActivityType) => void;
}

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.Exerting]: 'exerting',
  [ActivityType.Restorative]: 'restorative',
};

const ACTIVITY_TYPE_DESCRIPTIONS: Record<ActivityType, string> = {
  [ActivityType.Exerting]: 'uses energy',
  [ActivityType.Restorative]: 'restores energy',
};

export const ActivityTypeToggle: React.FC<ActivityTypeToggleProps> = ({ value, onChange }) => {
  return (
    <div className="activity-type-toggle">
      <div className="activity-type-toggle__label">activity type</div>
      <div className="activity-type-toggle__options" role="group" aria-label="activity type">
        {Object.values(ActivityType).map(type => (
          <button
            key={type}
            type="button"
            className={`activity-type-toggle__button activity-type-toggle__button--${type} ${
              value === type ? 'activity-type-toggle__button--active' : ''
            }`}
            onClick={() => onChange(type)}
            aria-pressed={value === type}
          >
            <span className="activity-type-toggle__type-name">{ACTIVITY_TYPE_LABELS[type]}</span>
            <span className="activity-type-toggle__description">
              {ACTIVITY_TYPE_DESCRIPTIONS[type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
