# Vector Tracking Implementation

This document describes the implementation of Vector pixel tracking in the command-bar application.

## Overview

The Vector tracking system has been implemented to track visitor behavior with proper deduplication and error handling. The implementation ensures that tracking is initialized only once per session when both `tenant_id` and `prospect_id` are available.

## Architecture

### Files Created

1. **`src/utils/vectorTracking.ts`** - Core tracking utility
2. **`src/hooks/useVectorTracking.ts`** - React hook for lifecycle management

### Integration Point

The tracking is integrated in `src/App.tsx` using the `useVectorTracking` hook.

## How It Works

### 1. Script Loading

- The Vector pixel script is loaded asynchronously from `https://cdn.vector.co/pixel.js`
- Script loading is idempotent - it won't load multiple times
- Error handling is in place for script loading failures

### 2. Composite ID Generation

The system creates a composite identifier by combining tenant_id and prospect_id:

```json
{
  "tenant_id": "your-tenant-id",
  "prospect_id": "your-prospect-id"
}
```

This composite ID is set as the `window.vector.partnerId` before calling `vector.load()`.

### 3. Conditional Loading

- Tracking is only initialized when both `tenant_id` and `prospect_id` are present
- Uses a flag to prevent duplicate initialization calls
- Automatically retries on error (flag reset on failure)

### 4. React Integration

The `useVectorTracking` hook manages the lifecycle:

- Monitors changes to `tenant_id` and `prospect_id`
- Prevents duplicate initialization attempts
- Provides status information

## Usage

### Basic Integration

```typescript
import { useVectorTracking } from './hooks/useVectorTracking';

function MyComponent() {
  const { isInitialized, hasRequiredData } = useVectorTracking({
    tenantId: 'your-tenant-id',
    prospectId: 'your-prospect-id',
    enabled: true, // optional, defaults to true
  });

  // Use isInitialized and hasRequiredData as needed
}
```

### Manual Control

```typescript
import { initializeVectorTracking, isVectorTrackingInitialized } from './utils/vectorTracking';

// Check if already initialized
if (!isVectorTrackingInitialized()) {
  // Initialize manually
  await initializeVectorTracking('tenant-id', 'prospect-id');
}
```

## Configuration

**Recommendation**: Make this configurable via environment variables or configuration files for different environments.

### Enable/Disable Tracking

Tracking can be disabled by setting `enabled: false` in the hook:

```typescript
const { isInitialized } = useVectorTracking({
  tenantId,
  prospectId,
  enabled: false, // Disables tracking
});
```

## Current Implementation Status

✅ **Completed:**

- Core tracking utility with error handling
- React hook for lifecycle management
- Integration in App component
- Conditional loading based on prospect_id presence
- Composite ID creation with JSON.stringify format
- Development testing utilities
- Proper deduplication to prevent multiple calls

✅ **Key Features:**

- Only initializes once when both tenant_id and prospect_id are available
- Handles script loading failures gracefully
- Provides status information for monitoring
- Development utilities for testing and debugging

## Production Considerations

### 1. Error Monitoring

The current implementation logs errors to console. Consider integrating with your error monitoring system (e.g., Sentry):

```typescript
// In vectorTracking.ts
import * as Sentry from '@sentry/react';

catch (error) {
  console.error('Vector tracking error:', error);
  Sentry.captureException(error);
}
```

### 2. Privacy Compliance

Ensure tracking complies with privacy regulations (GDPR, CCPA, etc.) by:

- Checking user consent before initialization
- Providing opt-out mechanisms
- Including in privacy policy

### 3. Performance Monitoring

Consider adding performance metrics to track script loading times and initialization success rates.

## Troubleshooting

### Common Issues

1. **Script not loading**

   - Check network connectivity
   - Verify Vector CDN is accessible
   - Check browser console for errors

2. **Tracking not initializing**

   - Verify both tenant_id and prospect_id are present
   - Check if already initialized using `isVectorTrackingInitialized()`
   - Use development utilities to debug

3. **Multiple initialization attempts**
   - The system prevents this automatically
   - Check console for "already initialized" messages
