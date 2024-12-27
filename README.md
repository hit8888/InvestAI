# Meaku

A monorepo built with Turborepo containing a chatbot application and shared packages.

## What's Inside

### Apps

- `chatbot` - React application built with Vite and TypeScript
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
- **Testing**: Jest
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

# Start development server for chatbot and related packages
pnpm dev:chat

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
│   ├── chatbot/           # Main chatbot application
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

- **Vite**: Selected as the build tool for the chatbot app because of:
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