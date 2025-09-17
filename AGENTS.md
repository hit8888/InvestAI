# AGENTS.md - AI Agent Guide for Meaku Frontend Monorepo

## Repository Overview

**Meaku** is a TypeScript/React monorepo that powers an AI agent platform with multiple frontend applications and shared packages. The codebase uses modern web technologies and follows a modular architecture optimized for scalability and developer productivity.

### Tech Stack Summary
- **Language**: TypeScript (5.8+)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom design systems
- **State Management**: Zustand, XState, React Context
- **Build System**: Turborepo with pnpm workspaces
- **Testing**: Vitest, Playwright (E2E)
- **Code Quality**: ESLint 9, Prettier, Husky pre-commit hooks

## Project Structure

```
meaku-frontend-mono_1/
├── apps/                      # Application packages
│   ├── agent/                 # Main agent application (React 19 + Vite)
│   ├── agent-admin/          # Admin dashboard (React 19)
│   ├── command-bar/          # Command bar application
│   └── scripts/              # Utility scripts for automation
├── packages/                 # Shared packages
│   ├── core/                # Business logic, API clients, stores
│   ├── design-system/       # UI component library (used by agent, agent-admin)
│   ├── saral/              # Shadcn/ui-based design system (used by command-bar, packages/shared)
│   ├── shared/             # Reusable business logic and utilities not in core
│   ├── config-eslint/      # ESLint configurations
│   ├── config-tailwind/    # Tailwind CSS configurations
│   └── config-typescript/  # TypeScript configurations
├── turbo.json              # Turborepo pipeline configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json           # Root package configuration
```

## Key Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development server for specific app
pnpm dev:agent      # Agent application
pnpm dev:admin     # Admin dashboard
pnpm dev:scripts   # Scripts application

# Start all development servers
pnpm dev

# Build entire monorepo
pnpm build

# Run tests
pnpm test
pnpm test:watch

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

### Testing Commands
```bash
# Unit tests (Vitest)
pnpm test
pnpm test:watch

# E2E tests (Playwright)
cd apps/agent
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Open Playwright UI
```

## Important Files and Their Purposes

### Root Configuration
- `turbo.json` - Defines build pipeline and task dependencies
- `pnpm-workspace.yaml` - Configures pnpm workspace packages
- `.gitignore` - Git ignore patterns
- `eslint.config.base.js` - Base ESLint configuration

### Application Configs (apps/agent)
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `playwright.config.ts` - E2E test configuration
- `vitest.config.ts` - Unit test configuration

## Code Architecture Patterns

### 1. State Management
The codebase uses multiple state management patterns:
- **Zustand** for global application state (see `stores/` directories)
- **XState** for complex state machines (demo flows, workflows)
- **React Context** for component-tree scoped state
- **React Query** for server state management

### 2. API Communication
- HTTP client: Axios with interceptors (`packages/core/src/http/`)
- WebSocket client: Custom implementation with health checks (`packages/core/src/networkClients/wsClient/`)
- API endpoints defined in `packages/core/src/http/api.ts`

### 3. Component Organization
```
components/
├── views/           # Page-level components
├── shared/          # Reusable components
└── ErrorBoundary/   # Error handling components
```

### 4. Hook Patterns
Custom hooks follow these conventions:
- `use` prefix for all hooks
- Located in `hooks/` directories
- Single responsibility principle
- Well-typed with TypeScript

## Working with the Codebase

### Adding a New Feature

1. **Identify the target package/app**
   - Features go in `apps/agent/src/`
   - Core shared logic (API, stores) goes in `packages/core/src/`
   - Other reusable business logic goes in `packages/shared/src/`
   - UI components for agent/agent-admin go in `packages/design-system/`
   - UI components for command-bar and packages/shared go in `packages/saral/`

2. **Follow existing patterns**
   - Use existing stores for state management
   - Follow component structure conventions
   - Use existing API client methods

3. **Type Safety**
   - Define types in `types/` directories
   - Use strict TypeScript settings
   - Avoid `any` types

### Common Tasks

#### Creating a New Component
```tsx
// apps/agent/src/components/views/YourComponent.tsx
import { FC } from 'react';
import { useYourHook } from '@/hooks/useYourHook';

export const YourComponent: FC<Props> = ({ ...props }) => {
  // Implementation
};
```

#### Adding an API Endpoint
```typescript
// packages/core/src/http/api.ts
export const yourEndpoint = {
  method: async (params: YourParams): Promise<YourResponse> => {
    return client.post('/endpoint', params);
  }
};
```

#### Creating a Store
```typescript
// packages/core/src/stores/useYourStore.ts
import { create } from 'zustand';

interface YourStore {
  // State
  // Actions
}

export const useYourStore = create<YourStore>((set) => ({
  // Implementation
}));
```

## Testing Guidelines

### Unit Tests
- Use Vitest for unit tests
- Place test files next to source files (`*.test.ts`, `*.test.tsx`)
- Mock external dependencies
- Focus on business logic testing

### E2E Tests
- Use Playwright for E2E tests
- Test files in `e2e/` directory
- Test critical user flows
- Use page object pattern when appropriate

## Build and Deploy

### Build Process
1. Turborepo orchestrates the build pipeline
2. Dependencies are built first (packages before apps)
3. Type checking runs in parallel
4. Vite bundles the applications

### Environment Variables
- Development: `.env` files (not committed)
- Production: Set via deployment platform
- TypeScript types in `src/types/env.ts`

## Common Patterns and Conventions

### File Naming
- Components: PascalCase (`ComponentName.tsx`)
- Hooks: camelCase with `use` prefix (`useHookName.ts`)
- Utilities: camelCase (`utilityName.ts`)
- Types: PascalCase (`TypeName.ts`)

### Import Aliases
- `@/` - Source root of current package
- `@meaku/core` - Core package
- `@breakout/design-system` - Design system package

### Code Style
- Use Prettier for formatting (configured)
- Follow ESLint rules (auto-fixable)
- Prefer functional components
- Use TypeScript strict mode

## Troubleshooting

### Common Issues

1. **Dependency conflicts**
   ```bash
   pnpm install --force
   ```

2. **Type errors after package updates**
   ```bash
   pnpm type-check
   ```

3. **Build failures**
   ```bash
   pnpm clean
   pnpm build
   ```

4. **Test failures**
   - Check test environment setup in `src/test/setup.ts`
   - Ensure mocks are properly configured

## Important Directories for AI Agents

### Core Business Logic
- `packages/core/src/` - Shared business logic, API clients, stores
- `packages/core/src/types/` - TypeScript type definitions
- `packages/core/src/utils/` - Utility functions

### Agent Application
- `apps/agent/src/components/` - React components
- `apps/agent/src/hooks/` - Custom React hooks
- `apps/agent/src/pages/` - Page components
- `apps/agent/src/stores/` - Zustand stores
- `apps/agent/src/machines/` - XState machines

### Design Systems
- `packages/design-system/` - Component library used by `apps/agent` and `apps/agent-admin`
- `packages/saral/` - Modern shadcn/ui-based components used by `apps/command-bar` and `packages/shared`

### Shared Packages
- `packages/core/` - Core business logic, API clients, and stores
- `packages/shared/` - Additional reusable business logic and utilities that don't belong in core

## Key Technologies to Understand

1. **React 19** - Latest React version with concurrent features
2. **Vite** - Fast build tool and dev server
3. **Turborepo** - Monorepo build system
4. **pnpm** - Fast, disk-efficient package manager
5. **Zustand** - Lightweight state management
6. **XState** - State machine library
7. **React Query** - Server state management
8. **Tailwind CSS** - Utility-first CSS framework
9. **TypeScript** - Static typing for JavaScript
10. **Playwright** - E2E testing framework

## Best Practices for AI Agents

1. **Always run type checking** before committing changes
2. **Follow existing patterns** - don't reinvent the wheel
3. **Write tests** for new features and bug fixes
4. **Use proper TypeScript types** - avoid `any`
5. **Keep components small** and focused
6. **Reuse existing utilities** from packages/core
7. **Document complex logic** with comments
8. **Handle errors gracefully** with proper error boundaries
9. **Optimize for performance** - use React.memo, useMemo when needed
10. **Follow the monorepo structure** - put code in the right package

## Security Considerations

- Never commit `.env` files
- Use environment variables for sensitive data
- Validate user inputs
- Sanitize data before rendering
- Use HTTPS for API calls
- Follow CORS policies
- Implement proper authentication checks

## Performance Optimization

- Lazy load components with React.lazy
- Use code splitting via dynamic imports
- Optimize bundle size with tree shaking
- Cache API responses appropriately
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Optimize images and media assets

## Monitoring and Debugging

- Sentry integration for error tracking (`useInitializeSentry.ts`)
- React Query DevTools for API debugging
- Browser DevTools for performance profiling
- Console logging with appropriate levels
- Source maps enabled in development

This guide should help AI agents effectively navigate and contribute to the Meaku frontend monorepo. Always prioritize code quality, type safety, and following established patterns when making changes.