# GitHub Copilot Instructions

## Project Overview

**Window** is a gamified 24-hour day planner that tracks activities and their impact on daily stats (energy, food, mood). Built with React + TypeScript, the application embodies a light, airy, and warm aesthetic.

## Development Principles

- Write clean, maintainable, and well-documented code
- Follow test-driven development (TDD) practices
- Prioritize accessibility from the start (WCAG 2.1 AA minimum)
- Use lowercase text for labels to create a friendly aesthetic
- Maintain the "window" theme: light, airy, warm, and inviting

## Documentation

All project guidelines are located in the `docs/` directory:

- `docs/functional-requirements.md` - Core feature specifications
- `docs/ui-guidelines.md` - Design and accessibility requirements
- `docs/testing-guidelines.md` - Testing standards
- `docs/coding-guidelines.md` - Code formatting and organization
- `docs/tech-stack.md` - Technology choices and tooling
- `docs/implementation-plan.md` - Phased development roadmap

**Always reference these documents when providing suggestions.**

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Vitest** and React Testing Library for testing
- **Context API + useReducer** for state management
- **localStorage** for data persistence
- **CSS Modules** with custom properties for styling

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules (includes React, a11y, and TypeScript plugins)
- Format with Prettier (enforced via git hooks)
- Write tests alongside features
- Use semantic HTML and ARIA when needed
- Maintain minimum 44px touch targets for accessibility

## Agent Usage

When working with AI coding agents:

1. Always review recent session notes for context
2. Follow established patterns from patterns-discovered.md
3. Consult functional requirements before implementing features
4. Write tests first (TDD approach)
5. Ensure accessibility compliance
6. Update documentation when making architectural decisions

## Memory System

### Overview

This project uses a **Working Memory System** to track development discoveries, patterns, and decisions across sessions.

### Memory Types

**Persistent Memory** (this file):

- Foundational development principles
- Core workflows and standards
- Long-term architectural decisions
- Permanent guidelines that rarely change

**Working Memory** (`.github/memory/` directory):

- Session summaries and historical context
- Discovered patterns and solutions
- Active session notes and discoveries
- Evolving learnings and insights

### Memory Files

| File                                      | Purpose                      | Committed? | When to Use                               |
| ----------------------------------------- | ---------------------------- | ---------- | ----------------------------------------- |
| `.github/memory/session-notes.md`         | Historical session summaries | ✅ Yes     | End of session to document completed work |
| `.github/memory/patterns-discovered.md`   | Reusable code patterns       | ✅ Yes     | When discovering useful patterns          |
| `.github/memory/scratch/working-notes.md` | Active session notes         | ❌ No      | During active development                 |

### Workflow

**During Development:**

1. Open `.github/memory/scratch/working-notes.md`
2. Document current task, approach, and findings as you work
3. Take notes during TDD cycles, debugging, and problem-solving

**End of Session:**

1. Review `scratch/working-notes.md`
2. Extract key findings to `session-notes.md`
3. Document any new patterns in `patterns-discovered.md`
4. Commit session-notes and patterns (scratch is not committed)

**Context-Aware Suggestions:**
When providing code suggestions:

- Reference `.github/memory/session-notes.md` to understand recent work
- Follow patterns from `.github/memory/patterns-discovered.md`
- Maintain consistency with documented approaches
- Avoid solutions that failed in previous sessions
- Build on established architectural decisions

### Example Prompts

**Starting work:**

```
"Review .github/memory/session-notes.md and patterns-discovered.md
to understand the current state of the project before we begin."
```

**During implementation:**

```
"Based on the patterns in .github/memory/patterns-discovered.md,
implement [feature] following our established approach."
```

**When debugging:**

```
"Check .github/memory/session-notes.md to see if similar
issues have been encountered and resolved before."
```

## Common Patterns

See `.github/memory/patterns-discovered.md` for detailed patterns. Key patterns include:

- React Context with TypeScript safety (throw errors if used outside Provider)
- Compound hooks for related operations (CRUD operations in one hook)
- localStorage utilities with error handling
- CSS custom properties for design system
- Accessible form components with built-in labels

## Testing Standards

- **Unit tests**: Test utilities, calculations, and isolated logic
- **Component tests**: Test UI components with React Testing Library
- **Integration tests**: Test feature workflows
- Run tests with `npm run test`
- Aim for >80% code coverage
- Test accessibility (keyboard navigation, screen readers, ARIA)

## UI/UX Requirements

- Light, airy, warm color palette (#fafafa backgrounds, warm accents)
- Lowercase text for labels and buttons
- Generous whitespace and smooth transitions
- Subtle shadows (rgba(0,0,0,0.05))
- WCAG 2.1 AA compliance minimum
- Support keyboard navigation
- Provide visible focus indicators
- Respect prefers-reduced-motion

## File Organization

```
src/
├── components/    # Reusable UI components
├── features/      # Feature-specific components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── context/       # React Context providers
└── styles/        # Global styles and variables
```

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## Best Practices

1. **Always reference documentation** before implementing
2. **Follow TDD**: Write test → See it fail → Implement → Refactor
3. **Update memory files**: Document discoveries and patterns
4. **Maintain accessibility**: Test with keyboard, screen readers
5. **Keep it simple**: Prefer clarity over cleverness
6. **Stay consistent**: Follow established patterns and conventions
