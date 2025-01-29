# CI/CD Workflow Documentation

## Overview
This document explains our CI/CD pipeline implemented in `.github/workflows/unified-workflow.yml`. The workflow handles building, testing, and deploying our frontend monorepo.

## Workflow Triggers
```yaml
on:
  push:
    branches: [release, main]
    paths:
      - "apps/**"
      - "packages/**"
      - ".github/workflows/**"
  pull_request:
    branches: [release, main]
```
Only triggers when changes are made to relevant paths, avoiding unnecessary runs.

## Key Components

### 1. Workflow Concurrency
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
Prevents multiple deployments running simultaneously and cancels in-progress workflows when new changes are pushed.

### 2. Code Quality Checks

#### ESLint
```yaml
- name: Run ESLint
  run: pnpm lint-staged
```
Uses the same lint-staged configuration as local development for consistency.

#### TypeScript Checks
```yaml
- name: Type Check Changed Files
  run: |
    # Run tsc in workspaces with changes
    pnpm --filter "<workspace>" tsc --noEmit
```
Performs TypeScript type checking on modified workspaces:
- Only checks files in apps/ and packages/ directories
- Respects workspace-specific tsconfig settings
- Excludes node_modules and other external files
- Runs checks in parallel for better performance

### 3. Unit Tests
Tests are run separately for different packages:

1. **Core Package Tests**
   ```bash
   # Run in packages/core directory
   pnpm test
   ```

2. **Agent App Tests**
   ```bash
   # Run in apps/agent directory with environment variables
   pnpm test
   ```

Environment variables are automatically set based on branch:
- release branch → production variables
- main branch → staging variables

Variables include:
- VITE_BASE_API_URL
- VITE_WEBSOCKET_URL
- VITE_SENTRY_DSN
- VITE_SENTRY_AUTH_TOKEN
- VITE_LOGROCKET_APP_ID
- VITE_APP_ENV

### 4. E2E Tests (Playwright)
E2E tests are selectively triggered in two scenarios:
1. When PR has the "run-e2e" label
2. On squash and merge commits

#### Why Selective E2E Testing?

1. **Resource Efficiency**
   - E2E tests are computationally expensive
   - Take longer to run (5-10 minutes)
   - Consume more CI minutes
   - Require browser installation

2. **Cost Optimization**
   - CI providers charge by minute
   - Browser downloads use bandwidth
   - Parallel runs can be expensive

3. **Development Velocity**
   - Not every change needs E2E testing
   - Quick feedback for non-UI changes
   - Focused testing when needed

4. **Strategic Testing**
   - Run E2E tests for:
     - UI-related changes
     - Critical user flows
     - Final merge to main/release
   - Skip for:
     - Documentation updates
     - Minor style changes
     - Backend-only changes

### 5. Script Deployment

#### Change Detection
```bash
# Automatically checks for changes in:
- apps/scripts/
- packages/core/
```

#### Build Process
Scripts are built using:
```bash
pnpm build
```

#### AWS Configuration
Uses AWS credentials for S3 upload:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS region: us-west-1

### 6. Error Handling
- Detailed error messages
- GitHub issue comments on failure
- Artifact retention for test reports

### 7. Failure Notifications

#### GitHub Comments
Automatically posts comments on PR when workflow fails:
```
❌ Workflow failed! Please check the Actions tab for more details.
```

#### Slack Integration
Sends detailed Slack notifications on failure including:
- Repository name
- Branch name
- Workflow name
- Direct link to failed workflow run

## Usage Guide

### For Developers

1. **Regular PRs**
   - Basic checks run automatically
   - Unit tests always run
   - Add "run-e2e" label if UI changes are included

2. **E2E Testing**
   ```bash
   # Locally
   pnpm exec playwright test
   
   # In CI
   # Add "run-e2e" label to PR
   ```

3. **Squash and Merge**
   - E2E tests run automatically
   - Ensures final integration testing
   - Validates the merged state

### Environment Variables
Managed through GitHub Secrets:
- PROD_* for production
- STAGING_* for staging

## Best Practices

1. **Label Usage**
   - Add "run-e2e" for UI changes
   - Remove if only updating docs/styles

2. **PR Organization**
   - Separate UI and non-UI changes
   - Clear commit messages
   - Proper branch naming

3. **Testing Strategy**
   - Run E2E locally before pushing
   - Group related UI changes
   - Consider test impact on CI time

## Troubleshooting

### Common Issues
1. **E2E Tests Not Running**
   - Check PR labels
   - Verify Playwright installation
   - Check browser cache

2. **Deployment Failures**
   - Verify AWS credentials
   - Check S3 permissions
   - Validate build output

### Support
For issues:
1. Check Actions tab logs
2. Review error notifications
3. Contact DevOps team 

## Resource Management

### 1. Caching Strategy
- Implements Playwright browser caching
- Uses pnpm caching for dependencies
- Optimizes CI runtime and resource usage

### 2. Timeout Settings
- Workflow timeout: 60 minutes
- Prevents hanging builds
- Conserves CI resources 