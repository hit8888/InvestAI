# Sevak Backend

Sevak is an AI assistant and routing service for the Meaku Agent-Admin Dashboard. It provides conversational AI assistance that helps users navigate the dashboard and perform actions through natural language queries.

**Key Feature: Optional Navigation Suggestions**

- The assistant answers questions conversationally
- Navigation routes and actions are **optional suggestions** that users can choose to follow
- Users can continue chatting and asking questions without executing any routes
- Routes are only provided when they would be genuinely helpful

## Architecture Overview

Sevak backend is built as a Node.js/TypeScript server that combines:

- **AI-powered routing**: Uses Groq API (Grok) to understand user questions and generate intelligent responses
- **REST API**: HTTP endpoints for synchronous requests
- **WebSocket server**: Real-time bidirectional communication via Socket.IO
- **Action system**: Supports UI automation actions (click, text_change) for guided workflows

## Directory Structure

```
apps/sevak/
├── routing-server/          # Main routing server application
│   ├── src/
│   │   ├── server.ts        # Express + Socket.IO server setup, REST/WebSocket handlers
│   │   ├── types.ts         # TypeScript type definitions for requests/responses
│   │   └── services/
│   │       └── grokService.ts    # Groq API integration, prompt management, response parsing
│   ├── DASHBOARD_KNOWLEDGE_BASE.md  # Knowledge base for AI context
│   ├── FEATURE_MAPPING.md           # Feature-to-route mappings
│   ├── ROUTING_AGENT_PROMPT.txt     # AI prompt template for routing
│   └── README.md                    # Detailed routing server documentation
└── README.md                 # This file - overall structure documentation
```

## Core Components

### 1. Server (`src/server.ts`)

The main entry point that sets up:

- **Express HTTP server**: Handles REST API endpoints
- **Socket.IO WebSocket server**: Handles real-time connections
- **Request handlers**: Process routing requests and return structured responses

**Key Endpoints:**

- `GET /health` - Health check
- `GET /status` - Check Grok API configuration
- `POST /api/route` - REST endpoint for routing requests
- `WebSocket: route:question` - WebSocket event for routing requests

**Request Flow:**

1. Receives user question via REST or WebSocket
2. Calls `getConversationalResponse()` from grokService
3. Processes and validates the response
4. Filters actions to only supported types (`click`, `text_change`)
5. Returns structured response with routes and actions

### 2. Types (`src/types.ts`)

Defines the TypeScript interfaces for the entire system:

- **`RoutingRequest`**: Input format `{ question: string }`
- **`RoutingResponse`**: Output format with `textResponse`, `navigationPath`, `routes`
- **`Action`**: Supported action types (`click`, `text_change`) with required fields
- **`RouteStep`**: Represents a navigation step with URL and actions
- **`NavigationPathItem`**: Visual representation items (page/action chips)

**Key Constraint**: Only `"click"` and `"text_change"` action types are supported. All other action types are filtered out.

### 3. Grok Service (`src/services/grokService.ts`)

Handles all AI interactions with the Groq API:

**Responsibilities:**

- Reads prompt files (routing prompt, knowledge base, feature mapping)
- Constructs system prompts with context
- Calls Groq API with user questions
- Parses JSON responses from AI
- Validates and cleans response data
- Filters actions to only supported types
- Handles legacy route format conversion

**Key Functions:**

- `getConversationalResponse(question)`: Main function that returns AI response with routes
- `getRouteFromGrok(question)`: Legacy function for simple route extraction

**Response Processing:**

1. Extracts JSON from AI response (handles markdown code blocks)
2. Cleans URLs (removes formatting, ensures leading `/`)
3. Filters actions to only `click` and `text_change`
4. Validates required fields (target for all actions, value for text_change)
5. Structures routes array (intermediate routes have empty actions, only final route has actions)

## Data Flow

### Request Processing Flow

```
User Question
    ↓
[Server receives via REST/WebSocket]
    ↓
[grokService.getConversationalResponse()]
    ↓
[Reads prompt files & constructs AI prompt]
    ↓
[Calls Groq API]
    ↓
[Parses JSON response]
    ↓
[Filters & validates actions (only click/text_change)]
    ↓
[Server processes response]
    ↓
[Returns RoutingResponse]
```

### Action Processing

Actions are processed with strict validation:

1. **Filtering**: Only `click` and `text_change` actions are allowed
2. **Validation**:
   - All actions require `target` field
   - `text_change` actions require `value` field
3. **Route Structure**:
   - Intermediate routes have empty `actions` arrays
   - Only the final route in a sequence can have actions
4. **Type Safety**: TypeScript ensures only valid action types are processed

## Action Types

### Supported Actions

#### `click`

- **Purpose**: Click on a UI element
- **Required Fields**: `type`, `target`, `description`, `stepNumber`
- **Target Format**: CSS selector or element ID
- **Example**:
  ```json
  {
    "type": "click",
    "target": "#upload-button",
    "description": "Click the upload button",
    "stepNumber": 1
  }
  ```

#### `text_change`

- **Purpose**: Change text in an input field
- **Required Fields**: `type`, `target`, `description`, `stepNumber`, `value`
- **Target Format**: CSS selector or element ID
- **Value**: The final text to input
- **Example**:
  ```json
  {
    "type": "text_change",
    "target": "#document-name-input",
    "description": "Enter the document name",
    "value": "My Document",
    "stepNumber": 2
  }
  ```

### Unsupported Actions (Filtered Out)

The following action types are **not supported** and will be filtered out:

- `navigate` - Navigation is handled via route URLs
- `wait` - Not supported in current implementation
- `highlight` - Not supported in current implementation
- `type` - Use `text_change` instead
- `scroll` - Not supported in current implementation

## Response Structure

### RoutingResponse Format

```typescript
{
  textResponse: string;                    // Conversational explanation
  navigationPath?: NavigationPathItem[];    // Visual path (chips)
  routes?: RouteStep[];                     // Navigation steps
  question: string;                        // Original question
}
```

### RouteStep Format

```typescript
{
  url?: string;              // Route URL (optional)
  actions: Action[];         // Actions array (empty for intermediate routes)
  description?: string;      // Step description
  ctaText?: string;          // Call-to-action text
  stepNumber?: number;       // Step number in sequence
}
```

### Route Sequence Rules

1. **Multiple Routes**: Routes array represents sequential navigation steps
2. **Intermediate Routes**: All routes except the last have empty `actions` arrays
3. **Final Route**: Only the last route can contain actions
4. **Action Execution**: Actions execute in order on the final destination page

## Configuration

### Environment Variables

- `PORT`: Server port (default: 8080)
- `GROK_API_KEY` or `GROQ_API_KEY`: Groq API key for AI responses (required)

### Prompt Files

The AI uses three key files for context:

1. **`ROUTING_AGENT_PROMPT.txt`**: Main routing instructions and rules
2. **`DASHBOARD_KNOWLEDGE_BASE.md`**: Knowledge about dashboard features
3. **`FEATURE_MAPPING.md`**: Feature-to-route mappings

These files are read at runtime and included in the AI system prompt.

## Development

### Starting the Server

```bash
# Development mode (with hot reload)
cd apps/sevak/routing-server
pnpm dev

# Production build
pnpm build
pnpm start
```

### Testing

```bash
# Health check
curl http://localhost:8080/health

# Status check
curl http://localhost:8080/status

# Test routing
curl -X POST http://localhost:8080/api/route \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I upload a document?"}'
```

## Example Questions and Responses

Here are some example questions and the responses you can expect from the system:

### Example 1: Uploading a Document

**Question:**

```json
{
  "question": "How do I upload a document?"
}
```

**Response:**

```json
{
  "textResponse": "To upload a document, navigate to the Datasets page and then click on the Documents section. From there, you can upload your document via a file picker or by dragging and dropping it into the upload area. Once uploaded, you can view the document's details, edit its information, or delete it if needed. Finally, ensure you re-embed the document to update your agent's training data.",
  "navigationPath": [
    { "label": "Datasets Page", "type": "page" },
    { "label": "Documents Section", "type": "page" },
    { "label": "Upload Document Button Click", "type": "action" },
    { "label": "Enter Document Name", "type": "action" }
  ],
  "question": "How do I upload a document?",
  "routes": [
    {
      "url": "/agent/datasets",
      "actions": [],
      "description": "Manage all knowledge sources for your agent",
      "ctaText": "Go to Datasets",
      "stepNumber": 1
    },
    {
      "url": "/agent/datasets/documents",
      "actions": [
        {
          "type": "click",
          "target": "#document-upload-button",
          "description": "Click the upload button to start the upload process",
          "stepNumber": 1
        },
        {
          "type": "text_change",
          "target": "#document-name-input",
          "description": "Enter the document name",
          "value": "My Document",
          "stepNumber": 2
        }
      ],
      "description": "Upload, manage, and view all your documents",
      "ctaText": "Manage Documents",
      "stepNumber": 2
    }
  ]
}
```

### Example 2: Viewing Conversations

**Question:**

```json
{
  "question": "Show me all my conversations"
}
```

**Response:**

```json
{
  "textResponse": "To view all your conversations, navigate to the Conversations page. This page shows your complete chat history, including all past interactions with visitors. You can filter, search, and manage your conversations from here.",
  "navigationPath": [{ "label": "Conversations Page", "type": "page" }],
  "question": "Show me all my conversations",
  "routes": [
    {
      "url": "/conversations",
      "actions": [],
      "description": "View all conversation history",
      "ctaText": "Go to Conversations",
      "stepNumber": 1
    }
  ]
}
```

### Example 3: Creating a New Dataset

**Question:**

```json
{
  "question": "I want to add training data for my agent"
}
```

**Response:**

```json
{
  "textResponse": "To add training data for your agent, navigate to the Datasets page. Here you can manage all knowledge sources including documents, webpages, videos, and slides. You can upload new content, organize existing data, and ensure your agent has the information it needs to answer questions accurately.",
  "navigationPath": [
    { "label": "Datasets Page", "type": "page" },
    { "label": "Add Training Data", "type": "action" }
  ],
  "question": "I want to add training data for my agent",
  "routes": [
    {
      "url": "/agent/datasets",
      "actions": [
        {
          "type": "click",
          "target": "#create-dataset-button",
          "description": "Click to create a new dataset",
          "stepNumber": 1
        }
      ],
      "description": "Manage all knowledge sources for your agent",
      "ctaText": "Go to Datasets",
      "stepNumber": 1
    }
  ]
}
```

### Example 4: Configuring Agent Branding

**Question:**

```json
{
  "question": "How do I customize my agent's appearance?"
}
```

**Response:**

```json
{
  "textResponse": "To customize your agent's appearance, navigate to the Branding page. Here you can modify the agent's visual design, including colors, logo, chat interface styling, and other appearance settings. You can also configure LLM settings that affect how your agent responds.",
  "navigationPath": [
    { "label": "Branding Page", "type": "page" },
    { "label": "Customize Appearance", "type": "action" }
  ],
  "question": "How do I customize my agent's appearance?",
  "routes": [
    {
      "url": "/agent/branding",
      "actions": [
        {
          "type": "click",
          "target": "#appearance-settings-tab",
          "description": "Click on the appearance settings tab",
          "stepNumber": 1
        },
        {
          "type": "text_change",
          "target": "#agent-name-input",
          "description": "Enter your agent's name",
          "value": "My Agent",
          "stepNumber": 2
        }
      ],
      "description": "Customize your agent's appearance and branding",
      "ctaText": "Go to Branding",
      "stepNumber": 1
    }
  ]
}
```

### Example 5: Testing Agent in Playground

**Question:**

```json
{
  "question": "I want to test my agent"
}
```

**Response:**

```json
{
  "textResponse": "To test your agent, navigate to the Playground page. This is where you can interact with your agent in a test environment, try different questions, and see how it responds. You can also use the preview mode to see how your agent will appear to visitors.",
  "navigationPath": [
    { "label": "Playground Page", "type": "page" },
    { "label": "Test Agent", "type": "action" }
  ],
  "question": "I want to test my agent",
  "routes": [
    {
      "url": "/training/playground",
      "actions": [],
      "description": "Test and preview your agent",
      "ctaText": "Go to Playground",
      "stepNumber": 1
    }
  ]
}
```

### Example 6: Multi-Step Navigation with Actions

**Question:**

```json
{
  "question": "How do I add a new team member?"
}
```

**Response:**

```json
{
  "textResponse": "To add a new team member, navigate to the Settings page and then go to the Members section. From there, you can invite new members, manage existing team members, and configure their permissions and roles.",
  "navigationPath": [
    { "label": "Settings Page", "type": "page" },
    { "label": "Members Section", "type": "page" },
    { "label": "Add Member Button Click", "type": "action" },
    { "label": "Enter Member Email", "type": "action" }
  ],
  "question": "How do I add a new team member?",
  "routes": [
    {
      "url": "/settings",
      "actions": [],
      "description": "Access settings and configuration",
      "ctaText": "Go to Settings",
      "stepNumber": 1
    },
    {
      "url": "/settings/members",
      "actions": [
        {
          "type": "click",
          "target": "#add-member-button",
          "description": "Click to add a new team member",
          "stepNumber": 1
        },
        {
          "type": "text_change",
          "target": "#member-email-input",
          "description": "Enter the member's email address",
          "value": "member@example.com",
          "stepNumber": 2
        }
      ],
      "description": "Manage team members and permissions",
      "ctaText": "Manage Members",
      "stepNumber": 2
    }
  ]
}
```

### Response Structure Notes

- **`textResponse`**: Always present - provides a conversational explanation
- **`navigationPath`**: Visual representation of the journey (used for UI chips/breadcrumbs)
- **`routes`**: Array of navigation steps
  - **Intermediate routes**: Have empty `actions` arrays - these are just navigation steps
  - **Final route**: Contains the `actions` array with `click` and `text_change` actions
- **Actions**: Only `click` and `text_change` types are supported
  - All actions require `target` (CSS selector or ID)
  - `text_change` actions also require `value` (the text to input)

### Type Checking

```bash
pnpm type-check
```

## Extending the System

### Adding New Action Types

To add a new action type:

1. **Update `types.ts`**: Add to `ActionType` union type
2. **Update `grokService.ts`**: Add to `GrokAction` interface and filter logic
3. **Update `server.ts`**: Add processing logic for the new action type
4. **Update AI prompt**: Add instructions for the new action type in `ROUTING_AGENT_PROMPT.txt`

### Adding New Routes

Routes are primarily determined by the AI based on the knowledge base and feature mapping. To add support for new routes:

1. **Update `DASHBOARD_KNOWLEDGE_BASE.md`**: Add information about the new feature
2. **Update `FEATURE_MAPPING.md`**: Add route mapping
3. **Update `DASHBOARD_KNOWLEDGE_BASE.md`**: Add new element IDs following the `{page}-{action}-{element-type}` convention

### Modifying AI Behavior

Edit the prompt files:

- `ROUTING_AGENT_PROMPT.txt`: Change routing rules and response format
- `DASHBOARD_KNOWLEDGE_BASE.md`: Update dashboard knowledge
- `FEATURE_MAPPING.md`: Update feature mappings

The AI prompt is constructed dynamically, so changes take effect on server restart.

## Architecture Decisions

### Why Only `click` and `text_change`?

These two action types cover the most common user interactions:

- **Click**: Button clicks, link navigation, element interaction
- **Text Change**: Form input, text editing, search queries

Other action types were removed to:

- Simplify the implementation
- Reduce complexity in frontend integration
- Focus on core use cases
- Improve type safety

### Why Filter Actions in Multiple Places?

Actions are filtered at multiple stages:

1. **grokService.ts**: Filters when parsing AI response
2. **server.ts**: Filters again for safety and validation

This ensures:

- Invalid actions never reach the client
- Type safety is maintained
- Graceful degradation if AI returns unsupported types

### Why Separate Intermediate and Final Routes?

This structure allows:

- Clear separation of navigation vs. actions
- Better UX (show navigation path, then actions)
- Easier frontend implementation
- More intuitive user guidance

## Future Components

- `client/` - Frontend client for Sevak (coming soon)

## Related Documentation

- See `routing-server/README.md` for detailed API documentation
- See `routing-server/ROUTING_AGENT_PROMPT.txt` for AI prompt details
- See `routing-server/DASHBOARD_KNOWLEDGE_BASE.md` for dashboard knowledge
