/**
 * App State Context - manages activities and user stats
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { Activity, UserStats, DailyData } from '../types';
import { initializeDefaultStats, getTodayDateString, clampEnergy } from '../utils/calculations';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../utils/storage';

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
  | { type: 'SET_FOOD'; payload: number }
  | { type: 'SET_MOOD'; payload: UserStats['mood'] }
  | { type: 'RESET_DAY'; payload: string }
  | { type: 'LOAD_DAY'; payload: DailyData };

const initialState: AppState = {
  currentDate: getTodayDateString(),
  stats: initializeDefaultStats(),
  activities: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload],
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id ? action.payload : activity
        ),
      };

    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload),
      };

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

    case 'SET_FOOD':
      return {
        ...state,
        stats: {
          ...state.stats,
          food: action.payload,
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

    case 'LOAD_DAY':
      return {
        currentDate: action.payload.date,
        stats: action.payload.stats,
        activities: action.payload.activities,
      };

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
    // Try to load saved data for today
    const savedData = loadFromLocalStorage<Record<string, DailyData>>(STORAGE_KEYS.DAILY_DATA);
    const today = getTodayDateString();

    if (savedData?.[today]) {
      return {
        currentDate: today,
        stats: savedData[today].stats,
        activities: savedData[today].activities,
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
