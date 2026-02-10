import React from 'react';
import { MoodState } from '../types';
import './MoodSelector.css';

interface MoodSelectorProps {
  mood: MoodState;
  onMoodChange: (mood: MoodState) => void;
}

const MOOD_EMOJIS: Record<MoodState, string> = {
  [MoodState.Sad]: '😢',
  [MoodState.Mad]: '😠',
  [MoodState.Neutral]: '😐',
  [MoodState.Happy]: '🙂',
  [MoodState.VeryHappy]: '😄',
};

const MOOD_LABELS: Record<MoodState, string> = {
  [MoodState.Sad]: 'sad',
  [MoodState.Mad]: 'mad',
  [MoodState.Neutral]: 'neutral',
  [MoodState.Happy]: 'happy',
  [MoodState.VeryHappy]: 'very happy',
};

const MOOD_ORDER: MoodState[] = [
  MoodState.Sad,
  MoodState.Mad,
  MoodState.Neutral,
  MoodState.Happy,
  MoodState.VeryHappy,
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ mood, onMoodChange }) => {
  return (
    <div className="mood-selector">
      <div className="mood-selector__label">mood</div>
      <div className="mood-selector__options" role="group" aria-label="mood selector">
        {MOOD_ORDER.map(moodOption => (
          <button
            key={moodOption}
            type="button"
            className={`mood-selector__button ${
              mood === moodOption ? 'mood-selector__button--active' : ''
            }`}
            onClick={() => onMoodChange(moodOption)}
            aria-label={MOOD_LABELS[moodOption]}
            aria-pressed={mood === moodOption}
          >
            <span className="mood-selector__emoji" aria-hidden="true">
              {MOOD_EMOJIS[moodOption]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
