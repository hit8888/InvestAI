# Routing Server

Part of the Sevak app - AI assistant and routing service for Meaku dashboard.

A Node.js WebSocket server that provides conversational AI assistance for the Meaku Agent-Admin Dashboard. It answers user questions conversationally and provides navigation CTAs with URLs and CSS selectors for highlighting relevant sections.

## Features

- **Conversational Responses**: Answers questions about the dashboard using comprehensive knowledge base
- **Smart Routing**: Analyzes user questions and determines the appropriate dashboard URL
- **Call-to-Action (CTA)**: Provides actionable navigation buttons when relevant pages exist
- **WebSocket Support**: Real-time communication via Socket.IO
- **REST API**: Optional HTTP endpoint for routing requests
- **CSS Selectors**: Provides selectors to highlight relevant sections on target pages
- **Grok AI Integration**: Uses Grok AI for intelligent responses and routing

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

The server will start on `http://localhost:8080`

## Production

```bash
pnpm build
pnpm start
```

## Usage

### WebSocket Connection

Connect via Socket.IO and emit `route:question` events with `{ question: string }`. Listen for `route:response` or `route:error` events.

**Response Format:**

```json
{
  "textResponse": "A helpful conversational answer to the user's question",
  "routes": [
    {
      "url": "/agent/datasets",
      "actions": [
        {
          "type": "navigate",
          "target": "/agent/datasets",
          "description": "Navigate to the datasets page",
          "stepNumber": 1
        },
        {
          "type": "wait",
          "waitFor": ".page-container",
          "description": "Wait for the page to load",
          "stepNumber": 2
        },
        {
          "type": "click",
          "target": "[data-testid='upload-button']",
          "description": "Click on the upload button",
          "stepNumber": 3
        },
        {
          "type": "wait",
          "waitFor": ".upload-modal",
          "description": "Wait for the upload modal to appear",
          "stepNumber": 4
        },
        {
          "type": "highlight",
          "target": "[data-testid='file-input']",
          "cssSelectors": ["[data-testid='file-input']"],
          "description": "Highlight the file input field",
          "stepNumber": 5
        }
      ],
      "description": "Step 1: Upload a document",
      "ctaText": "Go to Datasets",
      "stepNumber": 1
    }
  ],
  "question": "How do I upload a document?"
}
```

**Action Types:**

- `navigate`: Navigate to a URL (target should be the URL)
- `click`: Click on an element (target should be CSS selector or id)
- `wait`: Wait for something to load (waitFor should be CSS selector or text)
- `highlight`: Highlight an element (target and cssSelectors should be CSS selector or id)
- `type`: Type text into an input (target should be CSS selector, value should be text)
- `scroll`: Scroll to an element (target should be CSS selector)

The `routes` array contains sequential navigation steps. Each route can have multiple actions that execute in order.

### REST API

POST to `/api/route` with `{ question: string }` in the request body.

**Response Format:**

```json
{
  "textResponse": "A helpful conversational answer",
  "routes": [
    {
      "url": "/agent/datasets",
      "actions": [
        {
          "type": "navigate",
          "target": "/agent/datasets",
          "description": "Navigate to the datasets page",
          "stepNumber": 1
        },
        {
          "type": "highlight",
          "target": "[data-testid='datasets-list']",
          "cssSelectors": ["[data-testid='datasets-list']"],
          "description": "Highlight the datasets list",
          "stepNumber": 2
        }
      ],
      "description": "Step 1: View datasets",
      "ctaText": "Go to Datasets",
      "stepNumber": 1
    }
  ],
  "question": "How do I add training data?"
}
```

Note: The `routes` field is optional - it will only be present if there are relevant pages to navigate to. Each route contains an `actions` array with detailed steps to execute sequentially.

## Supported Routes

The server recognizes questions about:

- **Conversations**: All chats, live chats, leads, link clicks
- **Agent Configuration**: Datasets, workflow, branding, controls
- **Training**: Playground for testing
- **Analytics**: Insights and metrics
- **Visitor Intelligence**: Accounts, contacts, ICP
- **AI Features**: Blocks management
- **Settings**: Integrations, calendar, profile, members, embeddings
- **Configuration**: General config

See `ROUTING_AGENT_PROMPT.txt` in this directory for detailed routing rules.

## Environment Variables

- `PORT`: Server port (default: 8080)
- `GROK_API_KEY`: Grok API key from https://console.x.ai/ (required for conversational responses)

## Health Check

```bash
curl http://localhost:8080/health
```
