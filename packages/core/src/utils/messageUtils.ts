import {
  AgentEventType,
  ArtifactFormType,
  ArtifactMessageContent,
  BaseMessageContent,
  DemoEventData,
  ErrorEventData,
  EventMessageContent,
  MessageAnalyticsEventData,
  StreamMessageContent,
  WebSocketMessage,
} from '../types/webSocketData';
import { FormArtifactContent, SuggestionArtifactContent } from '../types';

export const USER_EVENTS_NOT_FOR_SCROLL_TO_TOP = [
  'PRIMARY_GOAL_COMPLETED',
  'PRIMARY_GOAL_CTA_CLICKED',
  'FORM_FILLED',
  'HEARTBEAT',
  'USER_INACTIVE',
];

export const isStreamMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: StreamMessageContent } => {
  return message.message_type === 'STREAM';
};

// Type guard for WebSocketMessage with is_complete
export const isStreamMessageComplete = (message: WebSocketMessage): boolean => {
  return (
    isStreamMessage(message) &&
    'message' in message &&
    typeof message.message === 'object' &&
    message.message !== null &&
    'is_complete' in message.message &&
    typeof message.message.is_complete === 'boolean' &&
    message.message.is_complete
  );
};

export const isTextMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: BaseMessageContent } => {
  return message.message_type === 'TEXT';
};

// Add a new function to check if a message should be displayed as text
export const isDisplayedAsTextMessage = (message: WebSocketMessage): boolean => {
  return (
    message.message_type === 'TEXT' ||
    message.message_type === 'STREAM' ||
    (message.message_type === 'EVENT' && message.message.event_type === 'SUGGESTED_QUESTION_CLICKED') ||
    (message.message_type === 'EVENT' && message.message.event_type === 'SLIDE_ITEM_CLICKED') ||
    (message.message_type === 'EVENT' && message.message.event_type === 'PRIMARY_GOAL_CTA_CLICKED') ||
    message.message_type === 'LOADING_TEXT'
  );
};

export const checkIsArtifactMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: ArtifactMessageContent } => {
  return message.message_type === 'ARTIFACT';
};

export const checkIsEventMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: EventMessageContent } => {
  return message.message_type === 'EVENT';
};

export const isMessageAnalyticsEvent = (
  message: WebSocketMessage,
): message is WebSocketMessage & {
  message: EventMessageContent & { event_type: 'MESSAGE_ANALYTICS' };
} => {
  return checkIsEventMessage(message) && message.message.event_type === 'MESSAGE_ANALYTICS';
};

export const isGeneratingMediaArtifactEvent = (message: WebSocketMessage) =>
  message.message_type === 'EVENT' &&
  'event_type' in message.message &&
  message.message.event_type === AgentEventType.GENERATING_ARTIFACT &&
  isMediaArtifact(message.message.event_data.artifact_type);

export const getDemoQuestionData = (message: WebSocketMessage | undefined): DemoEventData | null => {
  if (
    message?.message_type === 'EVENT' &&
    message?.message?.event_type === 'DEMO_QUESTION' &&
    'event_type' in message.message &&
    message.message.event_data &&
    'demo_available' in message.message.event_data
  ) {
    return message.message.event_data as DemoEventData;
  }
  return null;
};

export const isSuggestionArtifact = (msg: WebSocketMessage) =>
  msg.message_type === 'ARTIFACT' && 'artifact_type' in msg.message && msg.message.artifact_type === 'SUGGESTIONS';

export const filterOutSuggestions = (messages: WebSocketMessage[]) =>
  messages.filter((msg) => !isSuggestionArtifact(msg));

export const hasMatchingMessageType = (msg: WebSocketMessage, message: WebSocketMessage): boolean => {
  return msg.message_type === message.message_type;
};

export const isLoadingTextToContentUpdate = (msg: WebSocketMessage, message: WebSocketMessage): boolean => {
  return msg.message_type === 'LOADING_TEXT' && (isTextMessage(message) || isStreamMessage(message));
};

export const hasMatchingEventType = (msg: WebSocketMessage, message: WebSocketMessage): boolean => {
  return (
    'event_type' in msg.message &&
    'event_type' in message.message &&
    msg.message.event_type === message.message.event_type
  );
};

export const hasMatchingArtifactType = (msg: WebSocketMessage, message: WebSocketMessage): boolean => {
  return (
    'artifact_type' in msg.message &&
    'artifact_type' in message.message &&
    msg.message.artifact_type === message.message.artifact_type
  );
};

export const shouldUpdateMessage = (msg: WebSocketMessage, message: WebSocketMessage) => {
  // Basic checks: must be an 'ai' message with matching response_id
  if (msg.role !== 'ai' || msg.response_id !== message.response_id) {
    return false;
  }

  // Case 1: Replace LOADING_TEXT with TEXT or STREAM
  if (isLoadingTextToContentUpdate(msg, message)) {
    return true;
  }

  // Case 2: For TEXT or STREAM new messages
  if (isTextMessage(message) || isStreamMessage(message)) {
    return hasMatchingMessageType(msg, message);
  }

  // Case 3: For other message types
  // First, check if message types match
  if (!hasMatchingMessageType(msg, message)) {
    return false;
  }

  // At this point, msg.message_type === message.message_type
  // Additional checks for specific types
  if (checkIsEventMessage(msg)) {
    return hasMatchingEventType(msg, message);
  } else if (checkIsArtifactMessage(msg)) {
    return hasMatchingArtifactType(msg, message);
  } else {
    return true; // For other matching types, no additional checks needed
  }
};

const SUPPORTED_ARTIFACT_TYPES = ['SLIDE', 'SLIDE_IMAGE', 'VIDEO'] as const;
export type SupportedArtifactType = (typeof SUPPORTED_ARTIFACT_TYPES)[number];

export const isMediaArtifact = (type: string): type is SupportedArtifactType => {
  return SUPPORTED_ARTIFACT_TYPES.includes(type as SupportedArtifactType);
};

export const checkIsDiscoveryMessage = (message: WebSocketMessage): boolean => {
  return message.message_type === 'TEXT' && message.actor === 'DISCOVERY_QUESTIONS';
};

export const checkIsMainResponseMessage = (message: WebSocketMessage): boolean => {
  return (
    (message.actor === 'SALES' && (isStreamMessage(message) || isTextMessage(message))) ||
    (message.actor === 'ARTIFACT' && isTextMessage(message)) || //Being used for form acknowledgement
    (message.actor === 'EVENT' && (isStreamMessage(message) || isTextMessage(message)))
  );
};

export const checkIsSalesResponseComplete = (messagesWithSameResponseId: WebSocketMessage[]): boolean => {
  return messagesWithSameResponseId.some(
    (message) => checkIsMainResponseMessage(message) && (isStreamMessageComplete(message) || isTextMessage(message)),
  );
};

export const getAnalyticsEvent = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: EventMessageContent & {
        event_data: MessageAnalyticsEventData | ErrorEventData;
      };
    } => checkIsEventMessage(msg) && msg.message.event_type === 'MESSAGE_ANALYTICS' && 'event_data' in msg.message,
  );
};

export const getFormFilledEvent = (
  messages: WebSocketMessage[],
  formArtifactMessage:
    | (WebSocketMessage & { message: ArtifactMessageContent & { artifact_data: FormArtifactContent } })
    | undefined,
) => {
  if (!formArtifactMessage) {
    return undefined;
  }
  return messages.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: EventMessageContent & {
        event_data: ArtifactFormType;
      };
    } =>
      checkIsEventMessage(msg) &&
      msg.message.event_type === 'FORM_FILLED' &&
      'event_data' in msg.message &&
      formArtifactMessage.message.artifact_data.artifact_id === msg.message.event_data.artifact_id,
  );
};

export const getSuggestionsArtifactMessage = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: ArtifactMessageContent & {
        artifact_data: SuggestionArtifactContent;
      };
    } => checkIsArtifactMessage(msg) && msg.message.artifact_type !== 'SUGGESTIONS' && 'artifact_data' in msg.message,
  );
};

export const getFormArtifactMessage = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: ArtifactMessageContent & {
        artifact_data: FormArtifactContent;
      };
    } => checkIsArtifactMessage(msg) && msg.message.artifact_type === 'FORM' && 'artifact_data' in msg.message,
  );
};

export const shouldMessageScrollToTop = (message: WebSocketMessage) => {
  if (
    message.role === 'user' &&
    'event_type' in message.message &&
    !USER_EVENTS_NOT_FOR_SCROLL_TO_TOP.includes(message.message.event_type)
  ) {
    return true;
  }
  return false;
};
