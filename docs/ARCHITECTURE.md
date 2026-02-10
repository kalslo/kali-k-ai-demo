# Window Architecture Documentation

## Overview

Window is a gamified day planner built with React 18, TypeScript, and Vite. The application uses a clean, modular architecture focused on maintainability, testability, and accessibility.

## Architecture Principles

1. **Component-based UI**: Reusable, composable React components
2. **Type safety**: Strict TypeScript throughout
3. **Context-based state**: React Context API + useReducer for global state
4. **Local-first data**: All data stored in browser localStorage
5. **Test-driven development**: Comprehensive test coverage (>85%)
6. **Accessibility-first**: WCAG 2.1 AA compliance

## Project Structure

```
window/
├── docs/                      # Documentation
│   ├── USER_GUIDE.md         # User documentation
│   ├── FAQ.md                # Frequently asked questions
│   ├── ARCHITECTURE.md       # This file
│   ├── DEPLOYMENT.md         # Deployment guide
│   ├── functional-requirements.md
│   ├── implementation-plan.md
│   ├── tech-stack.md
│   ├── testing-guidelines.md
│   ├── ui-guidelines.md
│   └── coding-guidelines.md
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ActivityForm.tsx  # Form for adding/editing activities
│   │   ├── Button.tsx        # Base button component
│   │   ├── Card.tsx          # Container component
│   │   ├── DateNavigator.tsx # Day navigation controls
│   │   ├── EnergyBar.tsx     # Energy stat visualization
│   │   ├── ExertionSelector.tsx
│   │   ├── FoodLogger.tsx    # Quick food logging
│   │   ├── FoodTracker.tsx   # Food stats display
│   │   ├── Input.tsx         # Base input component
│   │   ├── MoodSelector.tsx  # Mood selection UI
│   │   ├── QuickActions.tsx  # Quick action buttons
│   │   ├── Select.tsx        # Base select component
│   │   ├── SleepLogger.tsx   # Quick sleep logging
│   │   ├── StatsPanel.tsx    # Combined stats display
│   │   ├── ThemeSelector.tsx # Theme picker (future)
│   │   ├── TimeBlock.tsx     # Individual hour block
│   │   ├── TimeBlockGrid.tsx # 24-hour grid
│   │   ├── Toast.tsx         # Notification component
│   │   └── WorkLogger.tsx    # Quick work logging
│   ├── context/
│   │   └── AppContext.tsx    # Global state management
│   ├── hooks/                # Custom React hooks
│   │   ├── useActivities.ts  # Activity CRUD operations
│   │   ├── useDailyTimeBlocks.ts
│   │   ├── useDayNavigation.ts
│   │   ├── useStats.ts       # Stats access and updates
│   │   └── useToast.ts       # Toast notifications
│   ├── styles/               # Global styles
│   │   ├── themes.css        # Theme definitions
│   │   └── variables.css     # CSS custom properties
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/                # Utility functions
│   │   ├── calculations.ts   # Date and stat calculations
│   │   ├── constants.ts      # App constants
│   │   ├── migrateLocalStorage.ts
│   │   ├── specialActivities.ts
│   │   ├── statsCalculation.ts
│   │   └── storage.ts        # localStorage utilities
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
└── tests/
    ├── unit/                 # Unit tests
    └── integration/          # Integration tests
```

## Core Concepts

### State Management

Window uses React Context API with useReducer for global state management:

```typescript
interface AppState {
  currentDate: string; // ISO date string (YYYY-MM-DD)
  stats: UserStats; // Energy, meals, snacks, mood
  activities: Activity[]; // Array of activities for current day
}
```

**Key Benefits**:

- No external state library dependencies
- TypeScript-safe state updates
- Predictable state transitions via reducer
- Easy to test

**State Flow**:

1. User interaction triggers dispatch
2. Reducer processes action
3. State updates
4. Components re-render
5. Data persists to localStorage

### Data Model

#### Activity

```typescript
interface Activity {
  id: string; // UUID
  name: string; // User-entered name
  startTime: number; // Hour (0-23)
  endTime: number; // Hour (0-23)
  exertionLevel: ExertionLevel;
  type: ActivityType; // Exerting or Restorative
  category?: ActivityCategory; // General, Sleep, Food
  foodType?: FoodType; // Meal or Snack (if food)
  date: string; // ISO date (YYYY-MM-DD)
}
```

#### UserStats

```typescript
interface UserStats {
  energy: number; // 0-100
  meals: number; // Count
  snacks: number; // Count
  mood: MoodState; // 5 mood states
}
```

#### DailyData

```typescript
interface DailyData {
  date: string; // ISO date
  stats: UserStats;
  activities: Activity[];
}
```

### Data Persistence

All data is stored in browser localStorage:

```typescript
localStorage.setItem('window:daily_data', JSON.stringify({
  '2026-02-10': {
    date: '2026-02-10',
    stats: { energy: 75, meals: 2, snacks: 1, mood: 'happy' },
    activities: [...]
  },
  '2026-02-11': { ... }
}));
```

**Storage Structure**:

- Key: `window:daily_data`
- Value: JSON object mapping dates to DailyData
- Format: `{ [date: string]: DailyData }`

**Migration System**:
The app includes an automatic migration system (`migrateLocalStorage.ts`) that runs on initialization to update old data formats to new formats (e.g., food points → meals/snacks).

### Component Architecture

#### Base Components

Reusable, accessible UI primitives:

- `Button`: Accessible button with variants
- `Input`: Labeled text input with validation
- `Select`: Accessible dropdown
- `Card`: Container with consistent styling

#### Feature Components

Domain-specific components:

- `TimeBlock`: Displays one hour, manages activity CRUD
- `TimeBlockGrid`: Renders 24 time blocks
- `ActivityForm`: Form for adding/editing activities
- `StatsPanel`: Displays current stats

#### Layout Components

Page structure:

- `App`: Top-level layout and routing
- `DateNavigator`: Day navigation UI
- `QuickActions`: Shortcut buttons

### Custom Hooks

Encapsulate business logic and state access:

- **useAppState()**: Access global state
- **useAppDispatch()**: Dispatch actions
- **useActivities()**: CRUD operations for activities
- **useStats()**: Get/update stats
- **useDailyTimeBlocks()**: Generate time block data
- **useDayNavigation()**: Navigate between days
- **useToast()**: Show toast notifications

### Energy Calculation System

Energy is calculated from all activities:

```typescript
function calculateEnergyChange(exertionLevel: ExertionLevel, type: ActivityType): number {
  const baseValues = {
    'very-low': 5,
    low: 10,
    moderate: 15,
    high: 20,
    'very-high': 30,
  };

  const value = baseValues[exertionLevel];
  return type === 'exerting' ? -value : value;
}
```

**Special Rules**:

- Sleep: +15 energy per hour (regardless of exertion level)
- Energy cap: Maximum 100, no minimum
- Food: Separate from energy (meals +30, snacks +10)

### Styling System

**CSS Modules** with custom properties:

```css
/* variables.css */
:root {
  --color-primary: #f87171;
  --color-background: #fafafa;
  --spacing-unit: 8px;
  --border-radius: 8px;
}
```

**Design Tokens**:

- Colors: Light, airy palette with warm accents
- Spacing: 8px base unit
- Typography: System font stack
- Shadows: Subtle, layered shadows

**Theme Support**:
Currently light theme only, dark theme planned for Phase 12.

### Testing Strategy

**Test Pyramid**:

1. **Unit Tests** (70%): Pure functions, utilities, calculations
2. **Component Tests** (25%): UI components with React Testing Library
3. **Integration Tests** (5%): Feature workflows

**Key Testing Patterns**:

- Mock localStorage in tests
- Use userEvent for realistic interactions
- Test accessibility (keyboard, screen readers)
- Snapshot tests for stable UI

**Coverage Targets**:

- Overall: >80%
- Utils: 100%
- Components: >75%
- Integration: Key workflows

## Data Flow

### Adding an Activity

```
1. User clicks time block
   ↓
2. TimeBlock renders ActivityForm
   ↓
3. User fills form and submits
   ↓
4. ActivityForm calls onSubmit with data
   ↓
5. TimeBlock dispatches ADD_ACTIVITY action
   ↓
6. Reducer updates state:
   - Adds activity to activities array
   - Recalculates stats
   ↓
7. State persists to localStorage
   ↓
8. UI re-renders with new data
```

### Day Navigation

```
1. User clicks "Previous Day"
   ↓
2. DateNavigator calls loadDay(newDate)
   ↓
3. useDayNavigation hook:
   - Calculates target date
   - Loads data from localStorage
   - Dispatches LOAD_DAY action
   ↓
4. Reducer updates currentDate and loads day data
   ↓
5. UI re-renders showing new day
```

## Performance Optimizations

### Current Optimizations

1. **Memoization**: Components use React.memo where appropriate
2. **Lazy state initialization**: useReducer init function
3. **Minimal re-renders**: Careful prop passing
4. **Efficient calculations**: Stats calculated once per state change

### Future Optimizations

- **Virtual scrolling**: For historical data views
- **Code splitting**: Route-based chunks
- **Service worker**: Offline support and caching
- **Web workers**: Background calculations for large datasets

## Security Considerations

### Current Implementation

- **No external requests**: All data stays local
- **No user authentication**: Not needed for local-only app
- **XSS prevention**: React escapes output by default
- **localStorage only**: No cookies, no server-side storage

### Future Enhancements

- **Data encryption**: Optional localStorage encryption
- **Export validation**: Sanitize exported data
- **Import validation**: Validate imported data structure

## Accessibility

### WCAG 2.1 AA Compliance

- ✅ Color contrast ratios meet AA standards
- ✅ All interactive elements keyboard accessible
- ✅ Focus indicators on all focusable elements
- ✅ ARIA labels on custom controls
- ✅ Semantic HTML structure
- ✅ Screen reader announcements for dynamic content
- ✅ 44px minimum touch targets
- ✅ Respects prefers-reduced-motion

### Accessibility Testing

- **Automated**: eslint-plugin-jsx-a11y, axe-core
- **Manual**: Keyboard navigation, screen reader testing
- **Tools**: VoiceOver (macOS), NVDA (Windows), Lighthouse

## Error Handling

### Current Strategy

1. **Graceful degradation**: App continues if non-critical errors occur
2. **Error boundaries**: (Planned) Catch React render errors
3. **localStorage failures**: Fallback to in-memory state
4. **Validation**: Input validation prevents invalid states

### Error Recovery

- **Corrupted data**: Migration system fixes old formats
- **Missing data**: Initialize with defaults
- **Parse errors**: Log error, use empty state

## Future Architecture Plans

### Phase 12: Advanced Features

- **Dark mode**: Theme system with user preference
- **Data export/import**: JSON backup/restore
- **Weekly/monthly views**: Calendar visualization
- **Activity templates**: Reusable activity presets
- **Statistics dashboard**: Trends and insights

### Phase 13: Cloud Sync (Optional)

- **Account system**: Optional user accounts
- **Cloud storage**: Sync across devices
- **Backend API**: REST or GraphQL API
- **Real-time sync**: WebSocket updates

## Development Guidelines

### Adding New Features

1. **Update types** in `src/types/index.ts`
2. **Write tests first** (TDD approach)
3. **Implement utility functions** in `src/utils/`
4. **Create components** in `src/components/`
5. **Add hooks** if needed in `src/hooks/`
6. **Update state management** in `AppContext.tsx`
7. **Style with CSS Modules**
8. **Test accessibility**
9. **Update documentation**

### Code Quality Checklist

- [ ] TypeScript strict mode (no `any`)
- [ ] ESLint passing (no errors)
- [ ] Prettier formatted
- [ ] Tests passing (>80% coverage)
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] Documentation updated
- [ ] No console.log in production code

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/react)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Questions?** Open an issue or see [FAQ.md](./FAQ.md)
