export enum SalesEvent {
  ARTIFACT_CONSUMED = "ARTIFACT_CONSUMED",
  FORM_FILLED = "FORM_FILLED",
}

export enum DemoEvent {
  DEMO_PREPARE = "DEMO_PREPARE",
  DEMO_NEXT = "DEMO_NEXT",
  DEMO_END = "DEMO_END",
  DEMO_QUESTION = "DEMO_QUESTION",
  DEMO_OPTIONS = "DEMO_OPTIONS",
}

export enum ArtifactEvent {
  ARTIFACT_RETRIEVE = "ARTIFACT_RETRIEVE",
}

export interface IWebSocketHandleMessage {
  message: string;
  eventType?: string;
  eventData?: Record<string, unknown>;
}

export type WebSocketEvents = SalesEvent | DemoEvent | ArtifactEvent;
