import React from 'react';
import { ExertionLevel, ActivityType } from '../types';
import { EXERTION_ENERGY_IMPACT } from '../utils/constants';
import './ExertionSelector.css';

interface ExertionSelectorProps {
  value: ExertionLevel;
  onChange: (level: ExertionLevel) => void;
  activityType: ActivityType;
}

const EXERTION_LABELS: Record<ExertionLevel, string> = {
  [ExertionLevel.VeryLow]: 'very low',
  [ExertionLevel.Low]: 'low',
  [ExertionLevel.Moderate]: 'moderate',
  [ExertionLevel.High]: 'high',
  [ExertionLevel.VeryHigh]: 'very high',
};

const EXERTION_ORDER: ExertionLevel[] = [
  ExertionLevel.VeryLow,
  ExertionLevel.Low,
  ExertionLevel.Moderate,
  ExertionLevel.High,
  ExertionLevel.VeryHigh,
];

export const ExertionSelector: React.FC<ExertionSelectorProps> = ({
  value,
  onChange,
  activityType,
}) => {
  const isExerting = activityType === ActivityType.Exerting;

  return (
    <div className="exertion-selector">
      <div className="exertion-selector__label">exertion level</div>
      <div className="exertion-selector__options" role="group" aria-label="exertion level">
        {EXERTION_ORDER.map(level => {
          const energyValue = EXERTION_ENERGY_IMPACT[level];
          const sign = isExerting ? '-' : '+';

          return (
            <button
              key={level}
              type="button"
              className={`exertion-selector__button exertion-selector__button--${level} ${
                value === level ? 'exertion-selector__button--active' : ''
              }`}
              onClick={() => onChange(level)}
              aria-pressed={value === level}
            >
              <span className="exertion-selector__level-name">{EXERTION_LABELS[level]}</span>
              <span className="exertion-selector__cost">
                {sign}
                {energyValue}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
