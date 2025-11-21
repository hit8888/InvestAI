export interface RoutingRequest {
  question: string;
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
  navigationPath?: NavigationPathItem[]; // Array of navigation steps for visual representation (chips with arrows)
  routes?: RouteStep[];
  question: string;
}
