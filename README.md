# window

A gamified 24-hour day planner that tracks your activities and their impact on your daily stats.

## Overview

**window** is a light, airy, and warm application designed to help you manage your day through 1-hour time blocks. Each activity you log affects three key stats:

- **Energy (0-100 points)** - Your daily capacity to do things. Activities either consume or restore energy based on their exertion level and type.
- **Food (meals & snacks)** - Track your eating habits. Goal: 3 meals + 1 snack per day.
- **Mood** - Monitor your emotional state throughout the day with 5 mood levels.

The gamification comes from managing your energy budget: exerting activities (work, exercise, chores) consume energy, while restorative activities (relaxing, hobbies, rest) restore it. Sleep gives you +15 energy per hour. The goal is to end each day with 20+ energy points!

## Features

- **24-Hour Time Block Grid** - Visualize your entire day at a glance
- **Activity Tracking** - Log activities with customizable exertion levels
- **Real-Time Stats** - Watch your energy, food, and mood update automatically
- **Special Activity Types** - Quick loggers for sleep, food, and work sessions
- **Day Navigation** - View and plan past and future days
- **Energy System** - Balance exerting and restorative activities
- **Fully Accessible** - WCAG 2.1 AA compliant, keyboard navigable
- **Local-First** - All data stored in your browser, no account needed
- **Responsive Design** - Works on desktop, tablet, and mobile

## How It Works

1. **Start your day** - Open Window and see 24 empty time blocks
2. **Add activities** - Click any block to log what you're doing
3. **Choose exertion level** - Select from very low to very high
4. **Pick activity type** - Exerting (consumes energy) or restorative (restores energy)
5. **Watch your stats** - See energy, food, and mood update in real-time
6. **Stay balanced** - Keep energy above 20 points for a successful day!

### Quick Example

- Log 8 hours of sleep (22:00-06:00) → +120 energy (capped at 100)
- Add "work" from 09:00-17:00 as moderate/exerting → -120 energy
- Log "lunch" at 12:00 → +1 meal
- Add "evening walk" at 18:00 as low/restorative → +10 energy
- Result: Started with 100, ended with 90 energy ✓

For a complete guide to using Window, see the [User Guide](./docs/USER_GUIDE.md).

## Key Concepts

### Energy System

- Energy ranges from 0-100 points
- **Exerting activities** (work, exercise, chores) consume energy
- **Restorative activities** (relaxing, hobbies, meditation) restore energy
- **Sleep** gives +15 energy per hour
- Goal: Keep energy above 20 points

**Exertion Levels** determine energy impact:

- Very Low: ±5 energy
- Low: ±10 energy
- Moderate: ±15 energy
- High: ±20 energy
- Very High: ±30 energy

### Food Tracking

- **Meals**: +30 points each (breakfast, lunch, dinner)
- **Snacks**: +10 points each
- Daily Goal: 3 meals + 1 snack = 100 points
- Food is tracked separately from energy

### Mood Tracking

Track your emotional state throughout the day:

- 😢 Sad → 😠 Mad → 😐 Neutral → 🙂 Happy → 😄 Very Happy
- Update anytime to reflect how you're feeling
- Independent of activities and energy

### Special Features

- **Sleep Logger** - Quickly log multi-hour sleep blocks
- **Food Logger** - Fast meal and snack entry
- **Work Logger** - Log multi-hour work sessions
- **Clear All** - Reset your day and start fresh

## Documentation

### User Documentation

- [User Guide](./docs/USER_GUIDE.md) - Complete guide to using Window
- [FAQ](./docs/FAQ.md) - Frequently asked questions

### Developer Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System architecture and design decisions
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to production
- [Functional Requirements](./docs/functional-requirements.md) - Core app features and specifications
- [UI Guidelines](./docs/ui-guidelines.md) - Design principles and accessibility requirements
- [Testing Guidelines](./docs/testing-guidelines.md) - Testing standards and practices
- [Coding Guidelines](./docs/coding-guidelines.md) - Code formatting and organization standards
- [Tech Stack](./docs/tech-stack.md) - Technology choices and tooling
- [Implementation Plan](./docs/implementation-plan.md) - Phased development roadmap
- [Copilot Instructions](./.github/copilot-instructions.md) - Development guidelines and principles

## Getting Started

### Prerequisites

- Node.js v18.x or higher (v20+ recommended)
- npm v10.x or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kalslo/kali-k-ai-demo.git
   cd kali-k-ai-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit and integration tests
- `npm run test:ui` - Run tests with Vitest UI

## Project Structure

```
window/
├── docs/              # Project documentation
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── features/      # Feature-specific components and logic
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # Global styles
│   ├── tests/         # Test utilities and setup
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Application entry point
└── tests/
    ├── unit/          # Unit tests
    └── integration/   # Integration tests
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **date-fns** - Date manipulation

See [docs/tech-stack.md](./docs/tech-stack.md) for complete technology details.

## Accessibility

Window is designed to be accessible to everyone:

- **WCAG 2.1 AA Compliant** - Meets accessibility standards
- **Keyboard Navigation** - Full app usable without a mouse (Tab, Enter, Escape, Arrow keys)
- **Screen Reader Support** - Proper ARIA labels and semantic HTML
- **High Contrast** - Color contrast ratios meet AA standards
- **Touch-Friendly** - Minimum 44px touch targets
- **Reduced Motion** - Respects `prefers-reduced-motion` setting

All interactive elements are keyboard accessible with visible focus indicators.

## Data & Privacy

- **Local-First** - All data stored in your browser's localStorage
- **No Account Required** - No sign-up, no login, no tracking
- **No External Requests** - Your data never leaves your device
- **No Cookies** - localStorage only
- **Private by Default** - Use in private/incognito mode (data won't persist)

Your data is yours. Window works completely offline with no backend servers.

## Performance

- **Tiny Bundle** - ~54 KB gzipped (includes React)
- **Fast Load Times** - First Contentful Paint <1.5s
- **Optimized Build** - Code splitting, tree shaking, minification
- **Source Maps** - Debug production issues easily

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes following the [coding guidelines](./docs/coding-guidelines.md)
3. Write tests for new features
4. Run linting and tests before committing
5. Git hooks will automatically run linting on staged files
6. Create a pull request

## Contributing

This project is part of an AI learning course. If you'd like to contribute:

1. Read the [coding guidelines](./docs/coding-guidelines.md) and [testing guidelines](./docs/testing-guidelines.md)
2. Check the [implementation plan](./docs/implementation-plan.md) for planned features
3. Fork the repository and create a feature branch
4. Write tests for new features
5. Ensure all tests pass and no linting errors
6. Submit a pull request

## Questions or Issues?

- **Using Window?** Check the [User Guide](./docs/USER_GUIDE.md) and [FAQ](./docs/FAQ.md)
- **Found a bug?** Open an issue on [GitHub](https://github.com/kalslo/kali-k-ai-demo/issues)
- **Want to deploy?** See the [Deployment Guide](./docs/DEPLOYMENT.md)
- **Architecture questions?** Read the [Architecture docs](./docs/ARCHITECTURE.md)

## Deployment

Window can be deployed to:

- **Vercel** (recommended) - One-command deployment
- **Netlify** - Easy deployment with edge functions
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Global CDN
- **AWS S3 + CloudFront** - Enterprise option

See the [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## License

Private project - All rights reserved

**Note**: This is a capstone project for an AI learning course.

---

**Ready to start?** Run `npm install && npm run dev` and open [http://localhost:5173](http://localhost:5173)

**Need help?** See the [User Guide](./docs/USER_GUIDE.md) or [FAQ](./docs/FAQ.md)

Built with ❤️ using React, TypeScript, and Vite • [View Documentation](./docs/)
