# Functional Requirements

## Application Overview

**Window** is a gamified 24-hour day planner that tracks user activities and their impact on daily stats. The application uses a time-block based interface divided into 1-hour segments spanning from midnight to midnight.

## Core Features

### 1. Time Management

- Display a 24-hour day planner with 1-hour time blocks
- Each day runs from midnight (00:00) to midnight (23:59)
- Users can assign activities to specific time blocks

### 2. Activity Tracking

- Users can add activities to time blocks
- Each activity has an associated exertion level (see Exertion System below)
- Activities automatically update user stats when logged
- Activities can be classified as either:
  - **Exerting**: Decreases energy (work, exercise, etc.)
  - **Restorative**: Increases energy (sleep, rest, etc.)

### 3. User Stats System

The application tracks three primary stats with daily maximums:

#### Energy

- Range: 0 to 100 points
- Daily goal: Not to dip below 20 points
- Sleep activities: +15 points per hour (capped at 100)
- Affected by activity exertion levels (see Exertion System)

#### Food

- Measured in points
- Daily goal: 3 meals + 1 snack
- Points awarded:
  - Meal: +30 points
  - Snack: +10 points

#### Mood

- Visual scale using emoji indicators
- Scale progresses through emotional states: sad → mad → neutral → happy → very happy (or similar gradations)
- User can select mood state

### 4. Exertion System

When logging an activity, users select an exertion level that determines the energy impact:

| Exertion Level | Energy Impact (Exerting) | Energy Impact (Restorative) |
| -------------- | ------------------------ | --------------------------- |
| Very Low       | -1                       | +1                          |
| Low            | -5                       | +5                          |
| Moderate       | -10                      | +10                         |
| High           | -15                      | +15                         |
| Very High      | -20                      | +20                         |

**Note**: Restorative activities use the same values as exerting activities but with positive modifiers instead of negative.
