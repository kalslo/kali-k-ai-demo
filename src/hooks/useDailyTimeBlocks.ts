/**
 * Custom hook for managing daily time blocks
 */

import { useMemo } from 'react';
import { TimeBlock } from '../types';
import { getTimeBlocksForDay } from '../utils/calculations';
import { useActivities } from './useActivities';

export function useDailyTimeBlocks(): TimeBlock[] {
  const { activities } = useActivities();

  const timeBlocks = useMemo(() => {
    const blocks = getTimeBlocksForDay();

    // Assign activities to their time blocks
    activities.forEach(activity => {
      for (let hour = activity.startTime; hour <= activity.endTime; hour++) {
        if (blocks[hour]) {
          blocks[hour].activity = activity;
        }
      }
    });

    return blocks;
  }, [activities]);

  return timeBlocks;
}
