/**
 * App State Context - manages activities and user stats
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { Activity, UserStats, DailyData, MoodState } from '../types';
import { initializeDefaultStats, getTodayDateString, clampEnergy } from '../utils/calculations';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../utils/storage';
import { calculateStatsFromActivities } from '../utils/statsCalculation';
import { migrateLocalStorageData } from '../utils/migrateLocalStorage';

interface AppState {
  currentDate: string;
  stats: UserStats;
  activities: Activity[];
}

type AppAction =
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
  | { type: 'SET_ENERGY'; payload: number }
  | { type: 'SET_MOOD'; payload: UserStats['mood'] }
  | { type: 'RESET_DAY'; payload: string }
  | { type: 'LOAD_DAY'; payload: DailyData };

const initialState: AppState = {
  currentDate: getTodayDateString(),
  stats: initializeDefaultStats(),
  activities: [],
};

/**
 * Helper function to resolve overlapping activities
 * When a new activity overlaps with existing ones, the existing activities are adjusted or removed
 */
function resolveOverlaps(newActivity: Activity, existingActivities: Activity[]): Activity[] {
  const result: Activity[] = [];

  for (const existing of existingActivities) {
    // Check if activities overlap
    const overlaps =
      (newActivity.startTime < existing.endTime && newActivity.endTime > existing.startTime) ||
      (existing.startTime < newActivity.endTime && existing.endTime > newActivity.startTime);

    if (!overlaps) {
      // No overlap, keep the existing activity as is
      result.push(existing);
      continue;
    }

    // Handle overlap cases
    // Case 1: New activity completely covers existing activity - delete existing
    if (newActivity.startTime <= existing.startTime && newActivity.endTime >= existing.endTime) {
      // Existing activity is completely covered, don't add it
      continue;
    }

    // Case 2: New activity is in the middle of existing - split existing into two
    if (newActivity.startTime > existing.startTime && newActivity.endTime < existing.endTime) {
      // Add first part (before new activity)
      result.push({
        ...existing,
        endTime: newActivity.startTime,
      });
      // Add second part (after new activity)
      result.push({
        ...existing,
        id: crypto.randomUUID(),
        startTime: newActivity.endTime,
      });
      continue;
    }

    // Case 3: New activity overlaps the start of existing - trim existing start
    if (newActivity.startTime <= existing.startTime && newActivity.endTime < existing.endTime) {
      result.push({
        ...existing,
        startTime: newActivity.endTime,
      });
      continue;
    }

    // Case 4: New activity overlaps the end of existing - trim existing end
    if (newActivity.startTime > existing.startTime && newActivity.endTime >= existing.endTime) {
      result.push({
        ...existing,
        endTime: newActivity.startTime,
      });
      continue;
    }

    // Default: keep existing (shouldn't reach here)
    result.push(existing);
  }

  return result;
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ACTIVITY': {
      // Resolve overlaps: remove or adjust activities that conflict with the new one
      const activitiesWithoutOverlaps = resolveOverlaps(action.payload, state.activities);
      const newActivities = [...activitiesWithoutOverlaps, action.payload];
      const newStats = calculateStatsFromActivities(newActivities, state.stats.mood);
      return {
        ...state,
        activities: newActivities,
        stats: newStats,
      };
    }

    case 'UPDATE_ACTIVITY': {
      const updatedActivities = state.activities.map(activity =>
        activity.id === action.payload.id ? action.payload : activity
      );
      const newStats = calculateStatsFromActivities(updatedActivities, state.stats.mood);
      return {
        ...state,
        activities: updatedActivities,
        stats: newStats,
      };
    }

    case 'DELETE_ACTIVITY': {
      const filteredActivities = state.activities.filter(
        activity => activity.id !== action.payload
      );
      const newStats = calculateStatsFromActivities(filteredActivities, state.stats.mood);
      return {
        ...state,
        activities: filteredActivities,
        stats: newStats,
      };
    }

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
          energy: clampEnergy(action.payload.energy ?? state.stats.energy),
        },
      };

    case 'SET_ENERGY':
      return {
        ...state,
        stats: {
          ...state.stats,
          energy: clampEnergy(action.payload),
        },
      };

    case 'SET_MOOD':
      return {
        ...state,
        stats: {
          ...state.stats,
          mood: action.payload,
        },
      };

    case 'RESET_DAY':
      return {
        ...initialState,
        currentDate: action.payload,
      };

    case 'LOAD_DAY': {
      // Recalculate stats from activities to ensure consistency
      const recalculatedStats = calculateStatsFromActivities(
        action.payload.activities,
        action.payload.stats.mood
      );

      return {
        currentDate: action.payload.date,
        stats: recalculatedStats,
        activities: action.payload.activities,
      };
    }

    default:
      return state;
  }
}

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState, init => {
    // Run migration first before loading any data
    migrateLocalStorageData();

    // Try to load saved data for today
    const savedData = loadFromLocalStorage<Record<string, DailyData>>(STORAGE_KEYS.DAILY_DATA);
    const today = getTodayDateString();

    if (savedData?.[today]) {
      const todayData = savedData[today];

      // Ensure mood exists (migration from old data)
      const mood = todayData.stats?.mood !== undefined ? todayData.stats.mood : MoodState.Neutral;

      // Always recalculate stats from activities to ensure consistency
      // This handles migration from old food points system to meals/snacks
      const recalculatedStats = calculateStatsFromActivities(todayData.activities || [], mood);

      return {
        currentDate: today,
        stats: recalculatedStats,
        activities: savedData[today].activities || [],
      };
    }

    return init;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const dailyData: DailyData = {
      date: state.currentDate,
      stats: state.stats,
      activities: state.activities,
    };

    const allData = loadFromLocalStorage<Record<string, DailyData>>(STORAGE_KEYS.DAILY_DATA) ?? {};
    allData[state.currentDate] = dailyData;

    saveToLocalStorage(STORAGE_KEYS.DAILY_DATA, allData);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}
