import React, { useMemo } from 'react';
import { TimeBlock } from './TimeBlock';
import { useDailyTimeBlocks } from '../hooks/useDailyTimeBlocks';
import './TimeBlockGrid.css';

export const TimeBlockGrid: React.FC = () => {
  const timeBlocks = useDailyTimeBlocks();

  // Get current hour for highlighting
  const currentHour = useMemo(() => {
    return new Date().getHours();
  }, []);

  // Split blocks into sections
  // Morning: 5 AM - noon
  const morningBlocks = timeBlocks.filter(block => block.hour >= 5 && block.hour < 12);
  // Afternoon: noon - 6 PM
  const afternoonBlocks = timeBlocks.filter(block => block.hour >= 12 && block.hour < 18);
  // Night: 6 PM - 5 AM (wraps around midnight)
  // Sort to show 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4
  const nightBlocks = timeBlocks
    .filter(block => block.hour >= 18 || block.hour < 5)
    .sort((a, b) => {
      // Convert hours < 5 to be after 23 for sorting
      const aHour = a.hour < 5 ? a.hour + 24 : a.hour;
      const bHour = b.hour < 5 ? b.hour + 24 : b.hour;
      return aHour - bHour;
    });

  return (
    <div className="time-block-grid">
      <div className="time-block-section">
        <h3 className="time-block-section__header">
          <span className="time-block-section__icon">☀️</span>
          <span className="time-block-section__title">morning</span>
        </h3>
        <div className="time-block-section__blocks">
          {morningBlocks.map(block => (
            <TimeBlock
              key={block.hour}
              hour={block.hour}
              activity={block.activity}
              isCurrent={block.hour === currentHour}
            />
          ))}
        </div>
      </div>

      <div className="time-block-section">
        <h3 className="time-block-section__header">
          <span className="time-block-section__icon">🌤️</span>
          <span className="time-block-section__title">afternoon</span>
        </h3>
        <div className="time-block-section__blocks">
          {afternoonBlocks.map(block => (
            <TimeBlock
              key={block.hour}
              hour={block.hour}
              activity={block.activity}
              isCurrent={block.hour === currentHour}
            />
          ))}
        </div>
      </div>

      <div className="time-block-section">
        <h3 className="time-block-section__header">
          <span className="time-block-section__icon">🌙</span>
          <span className="time-block-section__title">night</span>
        </h3>
        <div className="time-block-section__blocks">
          {nightBlocks.map(block => (
            <TimeBlock
              key={block.hour}
              hour={block.hour}
              activity={block.activity}
              isCurrent={block.hour === currentHour}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
