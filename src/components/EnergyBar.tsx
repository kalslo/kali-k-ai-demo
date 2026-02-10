import React from 'react';
import './EnergyBar.css';

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
}

export const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy }) => {
  // Guard against NaN values
  const safeEnergy = isNaN(energy) ? 0 : energy;
  const safeMaxEnergy = isNaN(maxEnergy) || maxEnergy <= 0 ? 100 : maxEnergy;

  // Clamp energy value between 0 and maxEnergy
  const clampedEnergy = Math.max(0, Math.min(safeEnergy, safeMaxEnergy));

  // Calculate percentage
  const percentage = Math.round((clampedEnergy / safeMaxEnergy) * 100);

  // Determine state based on energy level
  const getEnergyState = (): 'good' | 'warning' | 'low' => {
    if (clampedEnergy >= 50) return 'good';
    if (clampedEnergy >= 20) return 'warning';
    return 'low';
  };

  const energyState = getEnergyState();

  return (
    <div className="energy-bar">
      <div className="energy-bar__label">
        <span>energy</span>
        <span className="energy-bar__percentage">{percentage}%</span>
      </div>
      <div
        className="energy-bar__track"
        role="progressbar"
        aria-label="energy level"
        aria-valuenow={clampedEnergy}
        aria-valuemin={0}
        aria-valuemax={maxEnergy}
      >
        <div
          className={`energy-bar__fill energy-bar__fill--${energyState}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
