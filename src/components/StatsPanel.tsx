import React from 'react';
import { EnergyBar } from './EnergyBar';
import { FoodTracker } from './FoodTracker';
import { MoodSelector } from './MoodSelector';
import { UserStats } from '../types';
import './StatsPanel.css';

interface StatsPanelProps {
  stats: UserStats;
  onMoodChange: (mood: UserStats['mood']) => void;
  className?: string;
}

const MAX_ENERGY = 100;

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, onMoodChange, className }) => {
  return (
    <div className={`stats-panel ${className || ''}`}>
      <div className="stats-panel__stat">
        <EnergyBar energy={stats.energy} maxEnergy={MAX_ENERGY} />
      </div>

      <div className="stats-panel__stat">
        <FoodTracker meals={stats.meals} snacks={stats.snacks} />
      </div>

      <div className="stats-panel__stat">
        <MoodSelector mood={stats.mood} onMoodChange={onMoodChange} />
      </div>
    </div>
  );
};
