# User Left Tracking Feature

## Overview

This feature tracks when users leave the command-bar session by closing the browser tab or navigating away, but only when there has been meaningful interaction (at least one AI message in the conversation).

## Implementation

### Files Created/Modified

1. **`src/hooks/useUserLeftTracking.ts`** - Custom React hook that handles the tracking logic
2. **`src/App.tsx`** - Integrated the hook into the main App component
3. **`packages/core/src/constants/analytics.ts`** - Added `USER_LEFT` event constant

### How It Works

#### Conditions for Tracking

- Only triggers when there's at least one AI message in the conversation
- Uses a ref to prevent duplicate tracking within the same session
- Resets tracking eligibility when messages are cleared (new session)

#### Event Triggers

- **Primary**: `beforeunload` event when browser tab is closing

#### Event Data

The `USER_LEFT` event includes the following metadata:

```javascript
{
  message_count: number,        // Total messages in conversation
  ai_message_count: number,     // Number of AI messages
  user_message_count: number    // Number of user messages
}
```

### Usage

The hook is automatically initialized in the main App component:

```typescript
// In App.tsx
import { useUserLeftTracking } from './hooks/useUserLeftTracking';

function App() {
  // Initialize user left tracking
  useUserLeftTracking();
  // ... rest of component
}
```

### Features

#### Reliability

- Handles both desktop and mobile browser scenarios

#### Performance

- Lightweight implementation with minimal overhead
- Event listeners are properly cleaned up on component unmount
- Uses refs to avoid unnecessary re-renders

#### Smart Tracking

- Only tracks meaningful sessions (with AI interaction)
- Prevents duplicate events within the same session
- Automatically resets for new sessions

## Analytics Integration

The feature integrates with the existing analytics system using:

- `ANALYTICS_EVENT_NAMES.COMMAND_BAR.USER_LEFT` constant
- Standard `trackEvent` function from `useCommandBarAnalytics`
- Consistent event structure with other command-bar analytics

## Browser Compatibility

- **Desktop**: Uses `beforeunload` event
- **All browsers**: Graceful fallback with error handling

This implementation ensures reliable tracking of user session endings while maintaining clean, modular code that follows the existing patterns in the codebase.
