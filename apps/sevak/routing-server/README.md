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
          "type": "click",
          "target": "[data-testid='upload-button']",
          "description": "Click on the upload button",
          "stepNumber": 1
        },
        {
          "type": "text_change",
          "target": "[data-testid='document-name-input']",
          "description": "Enter the document name",
          "value": "My Document",
          "stepNumber": 2
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

**Action Types (Supported):**

- `click`: Click on an element (target should be CSS selector or id)
- `text_change`: Change text in an input field (target should be CSS selector or id, value should be the final text to input)

**Important Notes:**

- Only the **last route** in the `routes` array can have actions
- Intermediate routes have empty `actions` arrays
- Actions execute in order on the final destination page
- The `target` field is required for all actions
- The `value` field is required for `text_change` actions

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
          "type": "click",
          "target": "[data-testid='create-dataset-button']",
          "description": "Click to create a new dataset",
          "stepNumber": 1
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
