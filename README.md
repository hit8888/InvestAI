# InvestAI 

"InvestAI — News-Aware Portfolio Impact Simulator for Retail Investors"
2. The Problem (2-3 sentences)
Markets move on news, but no tool connects real-time global events directly to your specific holdings. Retail investors are left reading headlines and guessing. InvestAI bridges that gap.

3. What It Does
Ingests live news (political, economic, macro events) via [News API]
Runs each news item against your portfolio holdings
Uses Claude to simulate directional impact (bullish/bearish signal) per stock
Gives you a consolidated view of portfolio exposure to current events

4. How It Works (simple architecture diagram or bullet flow)
News APIs → Agent Core → Claude (impact simulation) → Portfolio Dashboard

5. Tech Stack (what you already have, just reframed)
Built with Claude Code in 2 days
React 19 + TypeScript + Vite (frontend)
Supabase (database)
Vercel (deployment)
Grok + News APIs (real-time data)
Turborepo monorepo architecture

6. Live Demo
Link to invest-ai-agent-admin.vercel.app

7. Why I Built This (1 paragraph)
This week, I watched tariff announcements, Fed signals, and geopolitical headlines move my portfolio in ways that felt impossible to reason about in real time. Every tool I had showed me what happened — charts, price drops, red numbers — but nothing told me why a specific stock in my portfolio was affected, or what the next headline might mean for it. I built InvestAI in a few days to close that gap: give me the news, show me my exposure, and let me make a more informed decision before the market does it for me.

## What's Inside

### Apps

- `agent` - React application built with Vite and TypeScript
- `scripts` - Utility scripts for the project

### Packages

- `core` - Shared business logic and utilities
- `design-system` - React component library with Storybook
- `config-eslint` - Shared ESLint configurations
- `config-tailwind` - Shared Tailwind CSS configuration
- `config-typescript` - Shared TypeScript configurations

## Tech Stack

- **Build Tool**: [Turborepo](https://turbo.build/) for monorepo management
- **Package Manager**: [pnpm](https://pnpm.io/) v8.15.6
- **UI Framework**: React 18.3 with TypeScript
- **Styling**: Tailwind CSS with custom configurations
- **Testing**: Vitest
- **Code Quality**:
  - ESLint with custom configurations
  - Prettier for code formatting
  - Husky for Git hooks
  - lint-staged for pre-commit checks
- **Documentation**: Storybook 8.x for component documentation

## Development

### Prerequisites

- Node.js >= 18
- pnpm 8.15.6

### Setup

```bash
# Install dependencies
pnpm install

# Start development server for agent and related packages
pnpm dev:agents

# Build all packages and apps
pnpm build

# Run tests
pnpm test

# Run type checking
pnpm type-check

# Format code
pnpm format

# Lint code
pnpm lint


```

### Scripts
dev - Start development servers
build - Build all packages and apps
test - Run tests
test:watch - Run tests in watch mode
lint - Run ESLint
type-check - Run TypeScript type checking
format - Format code with Prettier
clean - Clean build artifacts


```bash
.
├── apps/
│   ├── agent/           # Main agent application
│   └── scripts/           # Utility scripts
├── packages/
│   ├── core/              # Shared business logic
│   ├── design-system/     # React component library
│   ├── config-eslint/     # ESLint configurations
│   ├── config-tailwind/   # Tailwind CSS configuration
│   └── config-typescript/ # TypeScript configurations

```


## Technical Decisions

### Why This Stack?

- **Turborepo**: Chosen for efficient monorepo management offering:
  - Incremental builds and caching for faster development
  - Parallel task execution across packages
  - Intelligent dependency graph handling
  - Built-in task pipelines perfect for our React/TypeScript workflow

- **Vite**: Selected as the build tool for the agent app because of:
  - Lightning-fast HMR (Hot Module Replacement)
  - Out-of-the-box TypeScript support
  - Better development performance through ES modules
  - Optimized production builds with automatic code-splitting

- **pnpm**: Preferred over npm/yarn for:
  - Efficient disk space usage through content-addressable storage
  - Strict dependency resolution
  - Built-in monorepo support
  - Superior performance in package operations

- **React**: 
  - Concurrent rendering features
  - Automatic batching for better performance
  - Transitions API for improved UX
  - Strong TypeScript integration

## We have used React19 for admin dahboard  
