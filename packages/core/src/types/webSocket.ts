export enum SalesEvent {
  ARTIFACT_CONSUMED = "ARTIFACT_CONSUMED",
  FORM_FILLED = "FORM_FILLED",
}

export enum DemoEvent {
  DEMO_PREPARE = "DEMO_PREPARE",
  DEMO_NEXT = "DEMO_NEXT",
  DEMO_END = "DEMO_END",
  DEMO_QUESTION = "DEMO_QUESTION",
}

export enum ArtifactEvent {
  ARTIFACT_RETRIEVE = "ARTIFACT_RETRIEVE",
}

export type WebSocketEvents = SalesEvent | DemoEvent | ArtifactEvent;
