# Patterns Discovered

This file documents recurring code patterns, solutions, and best practices discovered during development. When you encounter similar situations in the future, reference these patterns for consistent, tested approaches.

---

## Pattern Template

Use this template when documenting a new pattern:

````markdown
## Pattern Name

**Context**: When does this apply? What situation calls for this pattern?

**Problem**: What problem does this solve? What goes wrong without it?

**Solution**: How to implement this pattern. Be specific.

**Example**:

```typescript
// Code example showing the pattern in use
```
````

**Related Files**:

- `path/to/file1.ts`
- `path/to/file2.tsx`

**Notes**: Any caveats, alternatives, or additional considerations.

---

````

---

## React Context with TypeScript Safety

**Context**: When creating React Context with TypeScript to manage application state.

**Problem**: TypeScript contexts often have `undefined` in their type, requiring null checks everywhere. Additionally, consumers might forget to wrap components in the Provider, leading to runtime errors.

**Solution**:
1. Create separate contexts for state and dispatch
2. Create custom hooks that throw errors if used outside Provider
3. Use reducer initialization function to load persisted state

**Example**:
```typescript
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

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
````

**Related Files**:

- `src/context/AppContext.tsx`

**Notes**:

- This pattern provides excellent developer experience with clear error messages
- TypeScript knows the return type is never undefined
- Similar pattern can be used for any React Context

---

## Compound Hook Pattern for Related Operations

**Context**: When building custom hooks that need to perform related operations on the same data structure (CRUD operations).

**Problem**: Multiple small hooks can lead to scattered logic and inconsistent state updates. A single large hook with all operations keeps related logic together.

**Solution**: Create one hook that returns an object with all related operations, ensuring they share the same context and can coordinate updates.

**Example**:

```typescript
export function useActivities() {
  const { activities } = useAppState();
  const dispatch = useAppDispatch();
  const { updateEnergy } = useStats();

  const addActivity = useCallback((...) => {
    // Add activity
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });

    // Update related stats
    updateEnergy(energyImpact);
  }, [dispatch, updateEnergy]);

  const deleteActivity = useCallback((...) => {
    // Delete and update stats
  }, [activities, dispatch, updateEnergy]);

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivitiesForHour,
  };
}
```

**Related Files**:

- `src/hooks/useActivities.ts`
- `src/hooks/useStats.ts`
- `src/hooks/useDailyTimeBlocks.ts`

**Notes**:

- Operations that modify state can coordinate updates (e.g., adding activity updates energy)
- Consumers get a clean API with one import
- useCallback prevents unnecessary re-renders

---

## localStorage Utilities with Error Handling

**Context**: When persisting data to localStorage in a browser environment.

**Problem**: localStorage can fail (quota exceeded, browser restrictions, privacy mode), throw errors, or contain corrupted data. Direct localStorage calls can crash the app.

**Solution**: Create utility functions that wrap localStorage operations with try-catch blocks and provide graceful fallbacks.

**Example**:

```typescript
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // Fail gracefully - app continues to work, just without persistence
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null; // Graceful fallback
  }
}
```

**Related Files**:

- `src/utils/storage.ts`

**Notes**:

- Always return a safe default (null) rather than throwing
- Log errors for debugging but don't show to users
- Consider adding retry logic or fallback storage mechanisms for production

---

## CSS Custom Properties for Design System

**Context**: When implementing a design system with consistent spacing, colors, and styling across components.

**Problem**: Hard-coded values scatter throughout CSS files, making it difficult to maintain consistency and update the design system.

**Solution**: Define all design tokens as CSS custom properties in a central file, then reference them throughout the stylesheet. This creates a single source of truth.

**Example**:

```css
/* variables.css */
:root {
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Colors */
  --color-bg-primary: #fafafa;
  --color-accent-warm: #f4a460;

  /* Shadows */
  --shadow-md: 0 2px 8px var(--color-shadow);
}

/* component.css */
.card {
  padding: var(--spacing-lg);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-md);
}
```

**Related Files**:

- `src/styles/variables.css`
- Various component CSS files

**Notes**:

- Variables cascade and can be overridden in specific components
- Browser support is excellent for modern development
- Makes dark mode implementation easier later (just swap variables)
- Aligns with design guidelines in docs/ui-guidelines.md

---

## Accessible Form Components with Built-in Labels

**Context**: When creating reusable form input components that need to be accessible.

**Problem**: Separating labels from inputs can lead to missing associations, making forms inaccessible to screen readers. Manual id generation is error-prone.

**Solution**: Build label/input associations into the component, auto-generating unique ids when not provided.

**Example**:

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} {...props} />
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
```

**Related Files**:

- `src/components/Input.tsx`
- `src/components/Select.tsx`

**Notes**:

- Always associate labels with inputs using htmlFor/id
- Use role="alert" for error messages so screen readers announce them
- Minimum 44px height for touch targets (accessibility requirement)
- Auto-generated ids are sufficient for most cases; provide explicit id when needed for form libraries

---

## Notes on Pattern Evolution

As the project grows, revisit these patterns:

- Mark patterns as deprecated if better approaches are found
- Add "See also" sections to link related patterns
- Include performance implications when relevant
- Document when NOT to use a pattern

If a pattern becomes foundational to the project, consider promoting it to `.github/copilot-instructions.md`.
