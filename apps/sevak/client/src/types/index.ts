// Types matching the routing-server types for consistency
export type MessageRole = "USER" | "AGENT";

export interface RoutingRequest {
  question: string;
  role?: MessageRole; // Optional, defaults to "USER" if not provided
}

export type ActionType = "click" | "text_change";

export interface Action {
  type: ActionType;
  target: string; // CSS selector or id (required for both click and text_change)
  description: string;
  value?: string; // Required for text_change actions - the final text to input
  stepNumber: number;
}

export interface RouteStep {
  url?: string; // Only for navigate actions
  actions: Action[];
  description?: string;
  ctaText?: string;
  stepNumber?: number;
}

export type NavigationPathItemType = "page" | "action";

export interface NavigationPathItem {
  label: string; // Display text for the chip
  type: NavigationPathItemType; // 'page' for page navigation, 'action' for user action
}

export interface RoutingResponse {
  textResponse: string;
  navigationPath: NavigationPathItem[]; // Array of navigation steps for visual representation (chips with arrows) - always present
  routes: RouteStep[]; // Always present, empty array if no routes
  question: string;
  role: MessageRole; // "USER" for user messages, "AGENT" for AI responses
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  navigationPath?: NavigationPathItem[];
  routes?: RouteStep[];
  question?: string; // Original question for USER messages
}

export interface SevakClientConfig {
  serverUrl?: string; // WebSocket server URL (defaults to ws://localhost:8080)
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  sessionId: string;
}
