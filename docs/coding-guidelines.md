# Coding Guidelines

## Overview

This document outlines the coding standards, formatting rules, and organizational practices for the Window application. Adhering to these guidelines ensures consistency, readability, and maintainability across the codebase.

## Code Formatting

### General Formatting Rules

- Use consistent indentation (2 or 4 spaces - maintain project consistency)
- Maximum line length: 100 characters (wrap longer lines appropriately)
- Use meaningful whitespace to improve readability
- Remove trailing whitespace from all lines
- End files with a single newline character

### Code Style

- Use consistent quote style (single or double quotes - maintain project consistency)
- Include spaces around operators (`x + y`, not `x+y`)
- Use consistent spacing in function calls and declarations
- Add blank lines between logical sections of code
- Avoid deeply nested code - refactor when nesting exceeds 3-4 levels

## Linting

### Linter Configuration

- Use a linter appropriate for the project's language (ESLint for JavaScript/TypeScript, Pylint for Python, etc.)
- Configure linter rules at the project level in a configuration file
- Ensure all team members use the same linter configuration
- Integrate linter checks into the development workflow

### Linting Requirements

- Code must pass all linting checks before being committed
- Fix linting errors - do not disable rules without documented justification
- Address linting warnings when possible
- Run linter automatically on save or commit (via IDE plugins or git hooks)

### Code Quality Rules

- Enforce consistent naming conventions via linter rules
- Catch common errors and anti-patterns
- Ensure proper use of language features
- Maintain consistent code style across the project

## Code Organization

### File Structure

- Organize files by feature or domain, not by file type
- Keep related files together
- Use clear, descriptive directory names
- Maintain a shallow directory hierarchy when possible

### Module Organization

- One primary component or class per file
- Group related utilities and helpers together
- Separate concerns appropriately (business logic, UI, data access)
- Use index files to manage exports from directories

### Import Management

- Group imports logically (external libraries, internal modules, relative imports)
- Order imports alphabetically within groups
- Remove unused imports
- Use absolute imports for better clarity when appropriate

## Naming Conventions

### General Principles

- Use descriptive, meaningful names that convey purpose
- Avoid abbreviations unless widely understood
- Be consistent with naming patterns across the codebase

### Specific Conventions

- **Variables and Functions**: Use camelCase (e.g., `getUserName`, `totalEnergy`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_ENERGY`, `DEFAULT_FOOD_POINTS`)
- **Classes and Components**: Use PascalCase (e.g., `ActivityTracker`, `EnergyBar`)
- **Files**: Use kebab-case for file names (e.g., `activity-tracker.js`, `energy-bar.css`)
- **Boolean Variables**: Use descriptive prefixes (e.g., `isActive`, `hasAccess`, `shouldRender`)

### Naming Guidelines

- Functions should start with verbs (e.g., `calculateEnergy`, `updateMood`)
- Classes should be nouns (e.g., `Activity`, `TimeBlock`)
- Avoid single-letter variables except in loops or mathematical contexts
- Use positive names for booleans when possible (prefer `isEnabled` over `isNotDisabled`)

## Code Comments

### When to Comment

- Explain complex algorithms or business logic
- Document non-obvious decisions or workarounds
- Clarify unusual code that might confuse future developers
- Provide context for "magic numbers" or hardcoded values

### When Not to Comment

- Don't state the obvious - code should be self-explanatory when possible
- Avoid redundant comments that simply restate the code
- Don't leave commented-out code in the codebase (use version control instead)

### Comment Style

- Write clear, concise comments
- Use proper grammar and punctuation
- Keep comments up-to-date when code changes
- Use JSDoc/docstring format for function and class documentation

## Best Practices

### Functions and Methods

- Keep functions small and focused on a single responsibility
- Limit function parameters (typically no more than 3-4)
- Use default parameters when appropriate
- Return early to reduce nesting

### Error Handling

- Handle errors explicitly - don't ignore them
- Provide meaningful error messages
- Log errors appropriately for debugging
- Fail fast and fail clearly

### Code Duplication

- Follow the DRY (Don't Repeat Yourself) principle
- Extract common logic into reusable functions or utilities
- Use composition and inheritance appropriately
- Refactor duplicated code when you notice it

### Performance Considerations

- Write clear code first, optimize only when necessary
- Profile before optimizing
- Document performance-critical sections
- Balance readability with performance needs

## Code Review Guidelines

- Review code for adherence to these guidelines
- Provide constructive feedback
- Check for logic errors and edge cases
- Ensure tests accompany code changes
- Verify documentation is updated when necessary
