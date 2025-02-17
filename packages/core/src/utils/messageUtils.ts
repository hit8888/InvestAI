import {
  AgentEventType,
  ArtifactMessageContent,
  DemoEventData,
  EventMessageContent,
  StreamMessageContent,
  WebSocketMessage,
} from '../types/webSocketData';

export const isStreamMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: StreamMessageContent } => {
  return message.message_type === 'STREAM';
};

export const isArtifactMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: ArtifactMessageContent } => {
  return message.message_type === 'ARTIFACT';
};

export const isEventMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: EventMessageContent } => {
  return message.message_type === 'EVENT';
};

export const isMessageAnalyticsEvent = (
  message: WebSocketMessage,
): message is WebSocketMessage & {
  message: EventMessageContent & { event_type: 'MESSAGE_ANALYTICS' };
} => {
  return isEventMessage(message) && message.message.event_type === 'MESSAGE_ANALYTICS';
};

export const isGeneratingArtifactEvent = (message: WebSocketMessage) =>
  message.message_type === 'EVENT' &&
  'event_type' in message.message &&
  message.message.event_type === AgentEventType.GENERATING_ARTIFACT;

export const getDemoEventData = (message: WebSocketMessage | undefined): DemoEventData | null => {
  if (
    message?.message_type === 'EVENT' &&
    'event_type' in message.message &&
    message.message.event_type === AgentEventType.DEMO_AVAILABLE
  ) {
    return message.message.event_data;
  }
  return null;
};

export const isSuggestionArtifact = (msg: WebSocketMessage) =>
  msg.message_type === 'ARTIFACT' && 'artifact_type' in msg.message && msg.message.artifact_type === 'SUGGESTIONS';

export const filterOutSuggestions = (messages: WebSocketMessage[]) =>
  messages.filter((msg) => !isSuggestionArtifact(msg));
