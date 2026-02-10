# Development Memory System

## Overview

This directory contains the **Working Memory System** for the Window application. It tracks development discoveries, patterns, decisions, and lessons learned during the development process. This system helps maintain context across development sessions and enables AI assistants to provide more context-aware suggestions.

## Purpose

The memory system serves several key purposes:

1. **Context Preservation**: Maintain development context across sessions
2. **Pattern Recognition**: Document recurring patterns and solutions
3. **Decision Tracking**: Record why certain architectural or implementation decisions were made
4. **Knowledge Transfer**: Help new developers (human or AI) understand the codebase evolution
5. **Problem Prevention**: Avoid repeating past mistakes by documenting lessons learned

## Types of Memory

### Persistent Memory

Located in `.github/copilot-instructions.md`, this contains:

- Foundational development principles
- Core workflows and standards
- Long-term architectural decisions
- Permanent guidelines that rarely change

### Working Memory

Located in `.github/memory/`, this contains:

- Session summaries and historical context
- Discovered patterns and solutions
- Active session notes and discoveries
- Evolving learnings and insights

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical session summaries (committed)
├── patterns-discovered.md       # Accumulated code patterns (committed)
└── scratch/
    ├── .gitignore              # Ignores all files in scratch/
    └── working-notes.md         # Active session notes (NOT committed)
```

## File Descriptions

### session-notes.md

**Purpose**: Document completed development sessions for future reference

**When to use**:

- At the END of a development session
- When wrapping up a significant feature or milestone
- After resolving a complex problem
- Before taking a break from the project

**What to include**:

- Session name and date
- What was accomplished
- Key findings and decisions made
- Outcomes and next steps
- Links to related commits or PRs

**Committed to git**: YES - This is historical record

---

### patterns-discovered.md

**Purpose**: Document recurring code patterns, solutions, and best practices

**When to use**:

- When you discover a useful pattern that could be reused
- After solving a problem that might recur
- When establishing a new convention or approach
- During code review when patterns emerge

**What to include**:

- Pattern name and description
- Context where the pattern applies
- Problem it solves
- Solution/implementation details
- Example code
- Related files

**Committed to git**: YES - These are permanent learnings

---

### scratch/working-notes.md

**Purpose**: Active note-taking during current development session

**When to use**:

- DURING active development
- For TDD cycles (write test, see failure, implement, refactor)
- While debugging issues
- When exploring different approaches
- For temporary thoughts and ideas

**What to include**:

- Current task description
- Approach being taken
- Key findings as you discover them
- Decisions made in the moment
- Blockers encountered
- Next steps to try
- Rough notes and ideas

**Committed to git**: NO - These are ephemeral notes

**Important**: At the end of your session, review these notes and extract the important findings into `session-notes.md` before discarding or overwriting.

---

## Workflow Integration

### Test-Driven Development (TDD) Workflow

```
1. Start Session
   └─> Open scratch/working-notes.md
   └─> Note current task and approach

2. Red Phase (Write Failing Test)
   └─> Document what you're testing and why
   └─> Note expected behavior

3. Green Phase (Make Test Pass)
   └─> Document implementation approach
   └─> Note any surprises or learnings
   └─> Record decisions made

4. Refactor Phase
   └─> Document refactoring rationale
   └─> Note any patterns emerging
   └─> Consider if pattern should go in patterns-discovered.md

5. End Session
   └─> Review working-notes.md
   └─> Extract key findings to session-notes.md
   └─> Document any new patterns to patterns-discovered.md
```

### Debugging Workflow

```
1. Encounter Bug
   └─> Document symptoms in working-notes.md
   └─> Note what you've tried

2. Investigation
   └─> Record hypotheses
   └─> Document findings from each approach
   └─> Note dead ends (important!)

3. Resolution
   └─> Document root cause
   └─> Record solution
   └─> Note prevention strategy

4. Clean Up
   └─> If pattern emerged, add to patterns-discovered.md
   └─> Summarize in session-notes.md
```

### Linting/Code Quality Workflow

```
1. Encounter Linting Issue
   └─> Document the rule being violated
   └─> Note why it matters

2. Fix Applied
   └─> Document the solution
   └─> If pattern applies broadly, add to patterns-discovered.md

3. Prevention
   └─> Consider if guideline should be in copilot-instructions.md
   └─> Document pattern for future reference
```

## How AI Uses This System

When you provide these memory files to an AI assistant:

1. **Context Awareness**: AI reads session-notes.md to understand recent work
2. **Pattern Application**: AI references patterns-discovered.md when suggesting code
3. **Consistency**: AI follows documented patterns and decisions
4. **Problem Avoidance**: AI avoids approaches that failed in the past
5. **Continuity**: AI can pick up where the last session left off

### Example AI Prompts

**Starting a new session**:

```
"I'm continuing work on [feature]. Please review .github/memory/session-notes.md
and .github/memory/patterns-discovered.md to understand our recent progress
and established patterns."
```

**During development**:

```
"Based on the patterns in .github/memory/patterns-discovered.md,
what's the best way to implement [feature]?"
```

**When debugging**:

```
"I'm seeing [error]. Check .github/memory/session-notes.md to see if we've
encountered similar issues before."
```

## Best Practices

### DO:

- ✅ Take notes in working-notes.md DURING development
- ✅ Extract important findings to session-notes.md at END of session
- ✅ Document patterns as soon as you recognize them
- ✅ Include code examples in pattern documentation
- ✅ Link to related files and commits
- ✅ Be specific about context and constraints
- ✅ Update patterns when you discover better approaches

### DON'T:

- ❌ Commit scratch/working-notes.md (it's in .gitignore)
- ❌ Let working notes pile up without summarizing
- ❌ Document obvious or language-standard patterns
- ❌ Keep outdated patterns without marking them deprecated
- ❌ Skip session notes for "small" sessions (they add up!)
- ❌ Copy-paste without understanding the pattern

## Maintenance

### Weekly

- Review session-notes.md for patterns that should be extracted
- Update patterns-discovered.md with improved versions
- Clean up scratch/ directory

### Monthly

- Review patterns for obsolete entries
- Consolidate related session notes
- Update copilot-instructions.md with promoted patterns

### As Needed

- When starting a major feature, review relevant patterns
- Before refactoring, check for documented approaches
- When onboarding, share all memory files

## Getting Started

1. **Start your session**: Open `scratch/working-notes.md` and fill in:
   - Current Task
   - Approach you plan to take

2. **During development**: Add notes as you work:
   - Findings
   - Decisions
   - Blockers
   - Ideas

3. **End your session**: Review and summarize:
   - Open `session-notes.md`
   - Create a new session entry
   - Summarize key learnings from working-notes.md
   - Update `patterns-discovered.md` if you found reusable patterns

4. **Next session**: Review previous session notes to regain context

## Questions?

If you're unsure where something belongs:

- **Is it a permanent principle?** → `.github/copilot-instructions.md`
- **Is it a completed session summary?** → `session-notes.md`
- **Is it a reusable code pattern?** → `patterns-discovered.md`
- **Is it an active thought/note?** → `scratch/working-notes.md`

When in doubt, start in `scratch/working-notes.md` and promote it later if needed.
