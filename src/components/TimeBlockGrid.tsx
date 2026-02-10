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

  return (
    <div className="time-block-grid">
      {timeBlocks.map(block => (
        <TimeBlock
          key={block.hour}
          hour={block.hour}
          activity={block.activity}
          isCurrent={block.hour === currentHour}
        />
      ))}
    </div>
  );
};
