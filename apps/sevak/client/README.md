# Sevak Client

React client library for the Sevak chat interface. This package provides components and hooks to integrate the Sevak assistant into your React applications.

## Installation

This package is part of the monorepo and can be imported directly:

```typescript
import { ChatInterface, useSevakChat } from "@sevak/client";
```

## Development Workflow

### Hot Module Replacement (HMR)

When imported in `agent-admin`, the client uses **direct source imports** via Vite alias configuration, which means:

✅ **No build step required** - Changes to client code automatically hot-reload in `agent-admin` dev server
✅ **Instant updates** - Edit files in `apps/sevak/client/src/` and see changes immediately
✅ **Full HMR support** - Vite processes the TypeScript/React source files directly

The alias in `agent-admin/vite.config.ts` points to the source directory:

```typescript
'@sevak/client': path.resolve(__dirname, '../../apps/sevak/client/src')
```

This means you can develop the client and see changes in real-time without rebuilding!

### Building for Production

When building for production, the client should be built first:

```bash
pnpm --filter @sevak/client build
```

This generates the `dist/` folder with the compiled library. In production builds, you may want to point the alias to `dist/` instead of `src/`.

## Features

- **Chat Interface Component**: Ready-to-use chat UI component
- **Custom Hooks**: `useSevakChat` hook for custom implementations
- **TypeScript Support**: Full type definitions included
- **WebSocket Integration**: Real-time communication with routing server
- **Message Roles**: Support for USER | AGENT message identification
- **Navigation Support**: Display navigation paths and routes from agent responses

## Usage

### Basic Chat Interface

```tsx
import { ChatInterface } from "@sevak/client";

function MyApp() {
  return (
    <div className="h-screen">
      <ChatInterface
        serverUrl="http://localhost:8080"
        onMessage={(message) => console.log("New message:", message)}
      />
    </div>
  );
}
```

### Using the Hook Directly

```tsx
import { useSevakChat } from "@sevak/client";

function CustomChat() {
  const { messages, sendMessage, isConnected, isLoading } = useSevakChat({
    serverUrl: "http://localhost:8080",
    onMessage: (message) => {
      // Handle new messages
    },
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => sendMessage("Hello!")}>Send</button>
    </div>
  );
}
```

## Configuration

### SevakClientConfig

```typescript
interface SevakClientConfig {
  serverUrl?: string; // WebSocket server URL (defaults to ws://localhost:8080)
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}
```

### ChatInterface Props

```typescript
interface ChatInterfaceProps extends SevakClientConfig {
  className?: string;
  placeholder?: string;
  showConnectionStatus?: boolean;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server (for standalone testing)
pnpm dev

# Build library
pnpm build

# Type check
pnpm type-check
```

## Environment Variables

- `VITE_SEVAK_SERVER_URL`: Default server URL (defaults to `http://localhost:8080`)

## Message Structure

Messages follow the `USER | AGENT` role structure:

- **USER**: Messages sent by the user
- **AGENT**: Messages received from the AI assistant

Each message includes:

- `id`: Unique message identifier
- `role`: "USER" | "AGENT"
- `content`: Message text
- `timestamp`: ISO timestamp
- `navigationPath`: Optional navigation chips (AGENT only)
- `routes`: Optional route steps (AGENT only)
