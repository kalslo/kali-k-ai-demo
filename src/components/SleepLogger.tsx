import React, { useState } from 'react';
import { Button } from './Button';
import { SLEEP_ENERGY_PER_HOUR } from '../utils/constants';
import './SleepLogger.css';

interface SleepLoggerProps {
  onAddSleep: (startHour: number, endHour: number) => void;
  onCancel: () => void;
}

export const SleepLogger: React.FC<SleepLoggerProps> = ({ onAddSleep, onCancel }) => {
  const [startHour, setStartHour] = useState(22); // Default: 10 PM
  const [endHour, setEndHour] = useState(6); // Default: 6 AM
  const [error, setError] = useState('');

  const calculateHours = (start: number, end: number): number => {
    if (end <= start) {
      // Sleep crosses midnight (e.g., 22:00 to 06:00 = 8 hours)
      return 24 - start + end;
    }
    return end - start;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hours = calculateHours(startHour, endHour);

    if (hours <= 0 || hours > 24) {
      setError('Invalid sleep duration');
      return;
    }

    onAddSleep(startHour, endHour);
  };

  const sleepHours = calculateHours(startHour, endHour);
  const energyGain = sleepHours * SLEEP_ENERGY_PER_HOUR;

  return (
    <form className="sleep-logger" onSubmit={handleSubmit}>
      <div className="sleep-logger__body">
        <div className="sleep-logger__time-fields">
          <div className="sleep-logger__field">
            <label htmlFor="sleep-start" className="sleep-logger__label">
              bedtime
            </label>
            <select
              id="sleep-start"
              className="sleep-logger__select"
              value={startHour}
              onChange={e => {
                setStartHour(Number(e.target.value));
                setError('');
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>

          <div className="sleep-logger__separator">→</div>

          <div className="sleep-logger__field">
            <label htmlFor="sleep-end" className="sleep-logger__label">
              wake time
            </label>
            <select
              id="sleep-end"
              className="sleep-logger__select"
              value={endHour}
              onChange={e => {
                setEndHour(Number(e.target.value));
                setError('');
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <span className="sleep-logger__error">{error}</span>}

        <div className="sleep-logger__summary">
          <div className="sleep-logger__stat">
            <span className="sleep-logger__stat-label">duration</span>
            <span className="sleep-logger__stat-value">{sleepHours} hours</span>
          </div>
          <div className="sleep-logger__stat">
            <span className="sleep-logger__stat-label">energy gained</span>
            <span className="sleep-logger__stat-value">+{energyGain}</span>
          </div>
        </div>
      </div>

      <div className="sleep-logger__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          cancel
        </Button>
        <Button type="submit" variant="primary">
          log sleep
        </Button>
      </div>
    </form>
  );
};
