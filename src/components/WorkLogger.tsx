import React, { useState } from 'react';
import { Button } from './Button';
import { WORK_ENERGY_PER_HOUR } from '../utils/constants';
import './WorkLogger.css';

interface WorkLoggerProps {
  onAddWork: (name: string, startHour: number, endHour: number) => void;
  onCancel: () => void;
}

export const WorkLogger: React.FC<WorkLoggerProps> = ({ onAddWork, onCancel }) => {
  const currentHour = new Date().getHours();
  const [name, setName] = useState('');
  const [startHour, setStartHour] = useState(currentHour >= 9 ? currentHour : 9); // Default to 9 AM or current hour
  const [endHour, setEndHour] = useState(currentHour >= 9 ? Math.min(currentHour + 1, 17) : 17); // Default to 1 hour or 5 PM
  const [error, setError] = useState('');

  const calculateHours = (start: number, end: number): number => {
    if (end <= start) {
      return 0;
    }
    return end - start;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hours = calculateHours(startHour, endHour);

    if (hours <= 0) {
      setError('End time must be after start time');
      return;
    }

    if (hours > 12) {
      setError('Work session cannot exceed 12 hours');
      return;
    }

    const workName = name.trim() || 'Work';
    onAddWork(workName, startHour, endHour);
  };

  const workHours = calculateHours(startHour, endHour);
  const energyCost = workHours * WORK_ENERGY_PER_HOUR;

  // Quick duration buttons
  const quickDurations = [1, 2, 4, 8];

  const handleQuickDuration = (hours: number) => {
    const newEnd = Math.min(startHour + hours, 23);
    setEndHour(newEnd);
    setError('');
  };

  return (
    <form className="work-logger" onSubmit={handleSubmit}>
      <div className="work-logger__body">
        <div className="work-logger__field">
          <label htmlFor="work-name" className="work-logger__label">
            what are you working on?
          </label>
          <input
            type="text"
            id="work-name"
            className="work-logger__input"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g., meeting, coding, design (optional)"
          />
        </div>

        <div className="work-logger__time-fields">
          <div className="work-logger__field">
            <label htmlFor="work-start" className="work-logger__label">
              start time
            </label>
            <select
              id="work-start"
              className="work-logger__select"
              value={startHour}
              onChange={e => {
                const newStart = Number(e.target.value);
                setStartHour(newStart);
                if (endHour <= newStart) {
                  setEndHour(Math.min(newStart + 1, 23));
                }
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

          <div className="work-logger__separator">→</div>

          <div className="work-logger__field">
            <label htmlFor="work-end" className="work-logger__label">
              end time
            </label>
            <select
              id="work-end"
              className="work-logger__select"
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

        <div className="work-logger__quick-actions">
          <span className="work-logger__quick-label">quick duration:</span>
          <div className="work-logger__quick-buttons">
            {quickDurations.map(hours => (
              <button
                key={hours}
                type="button"
                className="work-logger__quick-button"
                onClick={() => handleQuickDuration(hours)}
              >
                {hours}h
              </button>
            ))}
          </div>
        </div>

        {error && <span className="work-logger__error">{error}</span>}

        {workHours > 0 && (
          <div className="work-logger__summary">
            <div className="work-logger__stat">
              <span className="work-logger__stat-label">duration</span>
              <span className="work-logger__stat-value">{workHours} hours</span>
            </div>
            <div className="work-logger__stat">
              <span className="work-logger__stat-label">energy cost</span>
              <span className="work-logger__stat-value">-{energyCost}</span>
            </div>
          </div>
        )}
      </div>

      <div className="work-logger__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          cancel
        </Button>
        <Button type="submit" variant="primary" disabled={workHours <= 0}>
          log work
        </Button>
      </div>
    </form>
  );
};
