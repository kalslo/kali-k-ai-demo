# window

A gamified 24-hour day planner that tracks your activities and their impact on your daily stats.

## Overview

**window** is a light, airy, and warm application designed to help you manage your day through 1-hour time blocks (midnight to midnight). Track your energy, food intake, and mood while logging activities with varying exertion levels.

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

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes following the [coding guidelines](./docs/coding-guidelines.md)
3. Write tests for new features
4. Run linting and tests before committing
5. Git hooks will automatically run linting on staged files
6. Create a pull request

## Contributing

Please read our [coding guidelines](./docs/coding-guidelines.md) and [testing guidelines](./docs/testing-guidelines.md) before contributing.

## License

Private project - All rights reserved

capstone for AI learning course
