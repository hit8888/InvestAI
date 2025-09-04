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
  DemoEventDataSchema,
  CtaEventDataContent,
} from '../types/webSocketData';
import {
  ArtifactContent,
  CalendarArtifactContent,
  FormArtifactContent,
  MediaArtifactContent,
  SuggestionArtifactContent,
} from '../types';
import { MessageSenderRole, MessageViewType, ViewType, FormFilledEventType } from '../types/common';

export const USER_EVENTS_NOT_FOR_SCROLL_TO_TOP = ['HEARTBEAT', 'USER_INACTIVE'];

const { FORM_FILLED, QUALIFICATION_FORM_FILLED, GENERATING_ARTIFACT, CALENDAR_SUBMIT } = AgentEventType;

export const getMessagesWithSameResponseId = (messages: WebSocketMessage[], responseId: string) => {
  return messages.filter((msg) => msg.response_id === responseId);
};

export const isStreamMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: StreamMessageContent } => {
  return message.message_type === 'STREAM' && message.actor === 'SALES';
};

export const checkIsLoadingTextMessage = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: { content: string } } => {
  return message.message_type === 'LOADING_TEXT' && typeof message.message?.content === 'string';
};

export const isAIResponseInactiveMessage = (messages: WebSocketMessage[], message: WebSocketMessage): boolean => {
  const userInactiveMessage = messages.find((msg) => hasUserSentInactiveMessage(msg));
  const isUserInactiveMessage =
    isDisplayedAsTextMessage(message) && userInactiveMessage?.response_id === message.response_id;

  return isUserInactiveMessage;
};

export const hasUserSentInactiveMessage = (message: WebSocketMessage): boolean => {
  return (
    message.role === 'user' &&
    message.message_type === 'EVENT' &&
    'event_type' in message.message &&
    message.message.event_type === 'USER_INACTIVE'
  );
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

export const isPrimaryGoalCompletedMessage = (message: WebSocketMessage): boolean => {
  return (
    message.role === 'ai' && message.message_type === 'EVENT' && message.message.event_type === 'PRIMARY_GOAL_COMPLETED'
  );
};

export const isPrimaryGoalCTAClickedMessage = (message: WebSocketMessage): boolean => {
  return (
    message.role === 'user' &&
    message.message_type === 'EVENT' &&
    message.message.event_type === 'PRIMARY_GOAL_CTA_CLICKED'
  );
};

// Add a new function to check if a message should be displayed as text
export const isDisplayedAsTextMessage = (message: WebSocketMessage): boolean => {
  return (
    message.message_type === 'TEXT' ||
    message.message_type === 'STREAM' ||
    (message.message_type === 'EVENT' && message.message.event_type === 'SUGGESTED_QUESTION_CLICKED') ||
    (message.message_type === 'EVENT' && message.message.event_type === 'SLIDE_ITEM_CLICKED') ||
    (message.message_type === 'EVENT' && message.message.event_type === 'PRIMARY_GOAL_CTA_CLICKED') ||
    (message.message_type === 'EVENT' && message.role === 'admin') ||
    checkIsLoadingTextMessage(message)
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

export const isHeartbeatEvent = (
  message: WebSocketMessage,
): message is WebSocketMessage & {
  message: EventMessageContent & { event_type: 'HEARTBEAT_ACK' };
} => {
  return (
    checkIsEventMessage(message) &&
    (message.message.event_type === 'HEARTBEAT' || message.message.event_type === 'HEARTBEAT_ACK')
  );
};

export const isGeneratingMediaArtifactEvent = (message: WebSocketMessage) =>
  message.message_type === 'EVENT' &&
  'event_type' in message.message &&
  message.message.event_type === GENERATING_ARTIFACT &&
  isMediaArtifact(message.message.event_data.artifact_type);

export const isDemoAvailable = (message: WebSocketMessage): boolean => {
  return (
    message.role === 'ai' &&
    message.message_type === 'EVENT' &&
    message.actor === 'DEMO' &&
    message.message.event_type === 'DEMO_AVAILABLE' &&
    'event_data' in message.message &&
    message.message.event_data &&
    'demo_available' in message.message.event_data &&
    message.message.event_data.demo_available
  );
};

export const isDemoOptionsMessage = (message: WebSocketMessage): boolean => {
  return (
    message.role === 'ai' &&
    message.message_type === 'EVENT' &&
    message.actor === 'DEMO' &&
    message.message.event_type === 'DEMO_OPTIONS'
  );
};

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

export const isCalendarArtifact = (msg: WebSocketMessage) =>
  msg.message_type === 'ARTIFACT' && 'artifact_type' in msg.message && msg.message.artifact_type === 'CALENDAR';

export const filterOutSuggestions = (messages: WebSocketMessage[]) =>
  messages.filter((msg) => !isSuggestionArtifact(msg));

export const filterMessagesWithoutSessionId = (messages: WebSocketMessage[], message: WebSocketMessage) => {
  return filterMessagesWithSessionID(messages.filter((msg) => msg.response_id === message.response_id));
};

export const filterMessagesWithSessionID = (messages: WebSocketMessage[]) =>
  messages.filter((msg) => msg.session_id.length > 0);

export const hasMatchingMessageType = (msg: WebSocketMessage, message: WebSocketMessage): boolean => {
  return msg.message_type === message.message_type;
};

export const isLoadingTextToContentUpdate = (msg: WebSocketMessage, message: WebSocketMessage): boolean => {
  return checkIsLoadingTextMessage(msg) && (isTextMessage(message) || isStreamMessage(message));
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
    return hasMatchingMessageType(msg, message) && msg.session_id === message.session_id;
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
export const BASE_ARTIFACT_TYPES = ['SLIDE', 'SLIDE_IMAGE', 'VIDEO', 'FORM', 'CALENDAR', 'QUALIFICATION_FORM'] as const;
export const SUPPORTED_ARTIFACT_TYPES = [...BASE_ARTIFACT_TYPES] as const;
export type SupportedArtifactType = (typeof SUPPORTED_ARTIFACT_TYPES)[number];

export const isMediaArtifact = (type: string): type is SupportedArtifactType => {
  return SUPPORTED_ARTIFACT_TYPES.includes(type as SupportedArtifactType);
};

export const isDiscoveryQuestion = (message: WebSocketMessage): boolean => {
  return (
    message.message_type === 'EVENT' &&
    message.actor === 'DISCOVERY_QUESTIONS' &&
    message.message.event_type === 'DISCOVERY_QUESTIONS'
  );
};

export const hasDemoEndMessage = (messages: WebSocketMessage[]) => {
  return messages.find(
    (msg) => 'event_type' in msg.message && msg.message.event_type === 'DEMO_END' && msg.role === 'user',
  );
};

export const getDemoOptions = (demoOptionsMessageIndex: number, messages: WebSocketMessage[]) => {
  const demoOptionsMessage = messages[demoOptionsMessageIndex];
  const eventData =
    'event_data' in demoOptionsMessage.message
      ? (demoOptionsMessage.message.event_data as typeof DemoEventDataSchema)
      : null;

  if (
    !('event_type' in demoOptionsMessage.message) ||
    demoOptionsMessage.message.event_type !== 'DEMO_OPTIONS' ||
    !eventData
  ) {
    return null;
  }

  let demoFeatureName, demoEndMessageIndex;

  for (let index = demoOptionsMessageIndex; index < messages.length; index++) {
    const message = messages[index];

    if (
      'event_type' in message.message &&
      message.message.event_type === 'DEMO_NEXT' &&
      'event_data' in message.message &&
      'script_step' in message.message.event_data &&
      message.message.event_data.script_step &&
      'current_feature' in message.message.event_data.script_step
    ) {
      demoFeatureName = message.message.event_data.script_step.current_feature;
    }

    if ('event_type' in message.message && message.message.event_type === 'DEMO_END') {
      demoEndMessageIndex = index;
      break;
    }
  }

  if (demoEndMessageIndex && demoFeatureName) {
    return demoFeatureName;
  }

  return null;
};

export const isDiscoveryAnswer = (message: WebSocketMessage): boolean => {
  return message.message_type === 'EVENT' && message.message.event_type === 'DISCOVERY_ANSWER';
};

export const checkIsMainResponseMessage = (message: WebSocketMessage): boolean => {
  // isSuggestionArtifact(message) is added - bcoz we also show the suggestions when inactive event is send and we receive suggestions artifact
  return (
    (message.actor === 'SALES' && (isStreamMessage(message) || isTextMessage(message))) ||
    (message.actor === 'ARTIFACT' &&
      (isTextMessage(message) || isCalendarArtifact(message) || isSuggestionArtifact(message))) || //Being used for form acknowledgement
    (message.actor === 'EVENT' && (isStreamMessage(message) || isTextMessage(message)))
  );
};

export const checkIsLatestSalesResponseMessage = (
  messagesWithSameResponseId: WebSocketMessage[],
  message: WebSocketMessage,
): boolean => {
  const completeSalesResponseMessages = messagesWithSameResponseId.filter(
    (msg) => checkIsMainResponseMessage(msg) && isStreamMessage(msg),
  );

  if (completeSalesResponseMessages.length === 0) {
    return false;
  }

  const latestMessage = completeSalesResponseMessages.reduce((latest, current) =>
    new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest,
  );

  return message === latestMessage;
};

export const checkIsSalesResponseComplete = (messagesWithSameResponseId: WebSocketMessage[]): boolean => {
  return messagesWithSameResponseId.some(
    (message) =>
      checkIsMainResponseMessage(message) &&
      (isStreamMessageComplete(message) ||
        isTextMessage(message) ||
        isSuggestionArtifact(message) ||
        isCalendarArtifact(message)),
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

export const checkMessageIsFormFilled = (msg: WebSocketMessage, eventType: FormFilledEventType) => {
  return (
    checkIsEventMessage(msg) &&
    msg.message.event_type === eventType &&
    'event_data' in msg.message &&
    ((eventType === FORM_FILLED && 'form_data' in msg.message.event_data) ||
      (eventType === CALENDAR_SUBMIT && 'form_data' in msg.message.event_data) ||
      (eventType === QUALIFICATION_FORM_FILLED && 'qualification_responses' in msg.message.event_data))
  );
};

export const checkIfFormFilledMessageExists = (messages: WebSocketMessage[], eventType: FormFilledEventType) => {
  return messages.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: EventMessageContent & {
        event_data: ArtifactFormType;
      };
    } => checkMessageIsFormFilled(msg, eventType),
  );
};

export const getFormFilledEventByArtifactId = (
  messages: WebSocketMessage[],
  formArtifactMessage:
    | (WebSocketMessage & {
        message: ArtifactMessageContent & {
          artifact_data: ArtifactContent | FormArtifactContent | CalendarArtifactContent;
        };
      })
    | undefined
    | null,
  eventType: FormFilledEventType,
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
      'event_data' in msg.message &&
      'artifact_id' in msg.message.event_data &&
      formArtifactMessage.message.artifact_data.artifact_id === msg.message.event_data.artifact_id &&
      checkMessageIsFormFilled(msg, eventType),
  );
};

export const isCtaEvent = (
  message: WebSocketMessage,
  align?: CtaEventDataContent['align'],
): message is WebSocketMessage & {
  message: EventMessageContent & {
    event_data: CtaEventDataContent;
  };
} => {
  return (
    checkIsEventMessage(message) &&
    message.message?.event_type === 'CTA_EVENT' &&
    (!align || message.message?.event_data?.align === align)
  );
};

export const getCtaEvent = (
  messages: WebSocketMessage[],
  responseId?: string | undefined,
  align?: CtaEventDataContent['align'],
) => {
  return messages.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: EventMessageContent & {
        event_data: CtaEventDataContent;
      };
    } => isCtaEvent(msg, align) && (!responseId || msg.response_id === responseId),
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

export const getMediaArtifactMessage = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: ArtifactMessageContent & {
        artifact_data: MediaArtifactContent;
      };
    } =>
      msg.actor === 'ARTIFACT' &&
      checkIsArtifactMessage(msg) &&
      isMediaArtifact(msg.message.artifact_type) &&
      'artifact_data' in msg.message,
  );
};

export const checkIsAIMessage = (message: WebSocketMessage): boolean => {
  return message.role === MessageSenderRole.AI;
};

export const checkIsAdminJoinedMessage = (message: WebSocketMessage): boolean => {
  return message.message_type === 'EVENT' && message.message.event_type === 'JOIN_SESSION';
};

export const checkIsAdminLeftMessage = (message: WebSocketMessage): boolean => {
  return message.message_type === 'EVENT' && message.message.event_type === 'LEAVE_SESSION';
};

export const checkIsUserLeftMessage = (message: WebSocketMessage): boolean => {
  return message.message_type === 'EVENT' && message.message.event_type === 'USER_LEFT';
};

export function getMessageViewType(messageSenderRole: MessageSenderRole, viewType: ViewType): MessageViewType {
  if (messageSenderRole === MessageSenderRole.ADMIN) {
    switch (viewType) {
      case ViewType.ADMIN:
        return MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW;
      case ViewType.USER:
        return MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW;
      case ViewType.DASHBOARD:
        return MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW;
    }
  } else if (messageSenderRole === MessageSenderRole.USER) {
    switch (viewType) {
      case ViewType.ADMIN:
        return MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW;
      case ViewType.USER:
        return MessageViewType.USER_MESSAGE_IN_USER_VIEW;
      case ViewType.DASHBOARD:
        return MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW;
    }
  } else {
    switch (viewType) {
      case ViewType.ADMIN:
        return MessageViewType.AI_MESSAGE_IN_ADMIN_VIEW;
      case ViewType.USER:
        return MessageViewType.AI_MESSAGE_IN_USER_VIEW;
      case ViewType.DASHBOARD:
        return MessageViewType.AI_MESSAGE_IN_DASHBOARD_VIEW;
    }
  }
}

export const isHumanMessageInDashboardView = (messageViewType: MessageViewType) => {
  return [MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW, MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW].includes(
    messageViewType,
  );
};

export const isHumanMessageInAdminView = (messageViewType: MessageViewType) => {
  return [MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW, MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW].includes(
    messageViewType,
  );
};

// Check if the messages have the same session_id and response_id
export const hasMessagesMatchingIds = (msg1: WebSocketMessage, msg2: WebSocketMessage): boolean => {
  return msg1.session_id === msg2.session_id && msg1.response_id === msg2.response_id;
};

// Check if the artifact message is a form
export const checkIsFormArtifactBase = (
  message: WebSocketMessage,
): message is WebSocketMessage & { message: ArtifactMessageContent } => {
  return (
    checkIsArtifactMessage(message) &&
    message.message.artifact_type === 'FORM' &&
    !!message.message.artifact_data?.content
  );
};

export const checkIsQualificationFormArtifact = (message: WebSocketMessage): boolean => {
  if (!checkIsFormArtifactBase(message)) return false;
  const content = message.message.artifact_data.content;
  return content !== null && 'qualification' in content && Boolean(content.qualification);
};

export const isFormArtifactContent = (content: unknown): content is FormArtifactContent => {
  return typeof content === 'object' && content !== null && 'form_fields' in content && 'qualification' in content;
};

// Check if the stream message is for a form
export const hasStreamMessageForForm = (
  streamMessage: WebSocketMessage,
  artifactMessage: WebSocketMessage,
): artifactMessage is WebSocketMessage & { message: ArtifactMessageContent } => {
  return (
    hasMessagesMatchingIds(streamMessage, artifactMessage) &&
    checkIsAIMessage(streamMessage) &&
    isStreamMessage(streamMessage) &&
    checkIsAIMessage(artifactMessage) &&
    checkIsFormArtifactBase(artifactMessage)
  );
};

// This Function checks if AI is responding to a user message having NOT MUCH CONTEXT ABOUT the asked question
// AI Message responds with - "Great question!" (strict match) - which I am using for defining the min-height of the container
export const isAIMessageRespondingToUserMessageWithNotMuchContext = (message: WebSocketMessage) => {
  const requiredKeys = [
    'session_id',
    'response_id',
    'role',
    'actor',
    'message_type',
    'message',
    'documents',
    'timestamp',
  ];
  if (!requiredKeys.every((key) => key in message)) return false;

  // Validate role, actor, and message_type
  if (!checkIsAIMessage(message) || message.actor !== 'SALES' || !isStreamMessage(message)) {
    return false;
  }

  // Validate message content
  const content = message.message?.content;
  if (!content || typeof content !== 'string') return false;

  // Case-insensitive check for "Great question" (strict match)
  const pattern = /\bgreat\s+question\b/i;
  if (!pattern.test(content)) return false;

  return true;
};

export const isFormDataFilled = (
  formFields: FormArtifactContent['form_fields'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filledData: Record<string, any> | undefined,
) => {
  if (!filledData || !formFields) return false;

  return formFields.every((field) => {
    // Only check required fields
    if (!field.is_required) return true;

    const value = filledData[field.field_name];
    // Check if the value exists and is not null/empty string
    return value !== null && value !== undefined && value !== '';
  });
};

export const getFormArtifactMessage = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: ArtifactMessageContent & {
        artifact_data: FormArtifactContent;
      };
    } => checkIsFormArtifactBase(msg),
  );
};

export const getQualificationFormArtifactMessage = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: ArtifactMessageContent & {
        artifact_data: FormArtifactContent;
      };
    } =>
      checkIsArtifactMessage(msg) &&
      msg.message.artifact_type === 'QUALIFICATION_FORM' &&
      !!msg.message.artifact_data?.content,
  );
};

export const getCalendarArtifactMessage = (messagesWithSameResponseId: WebSocketMessage[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: ArtifactMessageContent & {
        artifact_data: CalendarArtifactContent;
      };
    } => checkIsArtifactMessage(msg) && msg.message.artifact_type === 'CALENDAR' && 'artifact_data' in msg.message,
  );
};

export const findArtifactMessageWithSameArtifactId = (messages: WebSocketMessage[], artifactId: string) => {
  return messages.find(
    (
      message,
    ): message is WebSocketMessage & {
      message: ArtifactMessageContent & { artifact_data: ArtifactContent | FormArtifactContent };
    } => {
      if (message.role !== 'ai' || !checkIsArtifactMessage(message)) return false;
      const artifactData = (message.message as ArtifactMessageContent).artifact_data;
      return artifactData.artifact_id === artifactId;
    },
  );
};

// User sends a message from Input
const isUserTextMessage = (message: WebSocketMessage): boolean => {
  return message.role === 'user' && 'message_type' in message && message.message_type === 'TEXT';
};

// User clicks on a suggestion or slide item
const isUserEventMessage = (message: WebSocketMessage): boolean => {
  return (
    message.role === 'user' &&
    'event_type' in message.message &&
    !USER_EVENTS_NOT_FOR_SCROLL_TO_TOP.includes(message.message.event_type)
  );
};

export const shouldMessageScrollToTop = (message: WebSocketMessage): boolean => {
  return isUserEventMessage(message) || isUserTextMessage(message);
};

// Helper function to check if a message is a main response (stream or text)
const isMainResponse = (message: WebSocketMessage): boolean => {
  return isStreamMessage(message) || isTextMessage(message);
};

// Helper function to check if a message should be delayed (discovery, artifact)
const isDelayedMessage = (message: WebSocketMessage): boolean => {
  return isDiscoveryQuestion(message) || checkIsArtifactMessage(message) || isCtaEvent(message);
};

// Helper function to check if a group of messages with same response_id is ready to be shown
const isMessageGroupReady = (messages: WebSocketMessage[]): boolean => {
  // If there's no stream message, the group is ready
  const streamMessage = messages.find((msg) => isStreamMessage(msg));
  const isDiscoveryQuestionMessage = messages.find((msg) => isDiscoveryQuestion(msg));
  // Adding this condition to prevent discovery questions from showing up before the stream message arrives
  if (!streamMessage) {
    if (isDiscoveryQuestionMessage) return false;
    return true;
  }

  // If there is a stream message, check if it's complete
  return isStreamMessageComplete(streamMessage);
};

// Helper function to get user message and incomplete stream message from a group
const getIncompleteGroupMessages = (messages: WebSocketMessage[]): WebSocketMessage[] => {
  const userMessage = messages.find((msg) => msg.role === MessageSenderRole.USER);

  // For Nudge Message, TEXT Message with No actor key
  const nudgeMessage = messages.find((msg) => msg.role === MessageSenderRole.AI && !msg.actor && isTextMessage(msg));

  const streamMessage = messages.find(isStreamMessage);
  const loadingMessage = messages.find((msg) => checkIsLoadingTextMessage(msg));

  const result: WebSocketMessage[] = [];
  if (userMessage) {
    result.push(userMessage);
  }
  if (nudgeMessage) {
    result.push(nudgeMessage);
  }
  // If there's no stream message yet but there's a loading message, show the loading message
  // This prevents discovery questions from showing up before the stream message arrives
  if (!streamMessage && loadingMessage) {
    result.push(loadingMessage);
  } else if (streamMessage) {
    result.push(streamMessage);
  }
  return result;
};

// This function, sortMessageGroup, takes an array of WebSocketMessage objects that all belong to the same group (for example, they share the same response_id).
// Its purpose is to sort these messages so that they are displayed in the correct order in the chat UI.
// The sorting rules are as follows:
// 1. Main response messages (like the main AI response) should always appear before "delayed" messages (such as discovery questions, artifacts, or CTA events).
// 2. If both messages are delayed, artifact messages should come before discovery questions.
//    - If both are artifact messages, media artifacts are prioritized over suggestion artifacts.
// 3. Messages that indicate a media artifact is being generated are not sorted with the others, but are instead appended at the end of the group.
// 4. For all other cases, the original order of the messages is preserved.
// The function returns a new array of messages, sorted according to these rules, ready to be rendered in the chat interface.
const sortMessageGroup = (messages: WebSocketMessage[]): WebSocketMessage[] => {
  const generatingArtifactMessages = messages.filter(isGeneratingMediaArtifactEvent);
  // messing up with sorting if message is of type media artifact generating
  const messagesToBeSorted = messages.slice().filter((msg) => !isGeneratingMediaArtifactEvent(msg));

  const resultantMessages = messagesToBeSorted.sort((a, b) => {
    // Always show user messages first
    if (a.role === MessageSenderRole.USER && b.role !== MessageSenderRole.USER) return -1;
    if (a.role !== MessageSenderRole.USER && b.role === MessageSenderRole.USER) return 1;

    const aIsMainResponse = isMainResponse(a);
    const bIsMainResponse = isMainResponse(b);
    const aIsDelayed = isDelayedMessage(a);
    const bIsDelayed = isDelayedMessage(b);

    // Always show main responses before delayed messages
    if (aIsMainResponse && bIsDelayed) return -1;
    if (aIsDelayed && bIsMainResponse) return 1;

    // If both are delayed messages, prioritize artifacts over discovery
    if (aIsDelayed && bIsDelayed) {
      const aIsArtifact = checkIsArtifactMessage(a);
      const bIsArtifact = checkIsArtifactMessage(b);
      const aIsDiscovery = isDiscoveryQuestion(a);
      const bIsDiscovery = isDiscoveryQuestion(b);

      // First priority: If both are artifacts, prioritize media artifacts over suggestion artifacts
      if (aIsArtifact && bIsArtifact) {
        const aIsMediaArtifact = aIsArtifact && isMediaArtifact(a.message.artifact_type);
        const bIsMediaArtifact = bIsArtifact && isMediaArtifact(b.message.artifact_type);
        const aIsSuggestion = isSuggestionArtifact(a);
        const bIsSuggestion = isSuggestionArtifact(b);

        if (aIsMediaArtifact && bIsSuggestion) return -1;
        if (aIsSuggestion && bIsMediaArtifact) return 1;
      }

      // Second priority: Any artifact should come before discovery questions
      if (aIsArtifact && bIsDiscovery) return -1;
      if (aIsDiscovery && bIsArtifact) return 1;
    }

    // For all other cases, maintain their original order
    return 0;
  });

  // Adding non-sorted messages back (e.g., at the end)
  return [...resultantMessages, ...generatingArtifactMessages];
};

// This function groups messages by response_id and then sorts them by the first occurrence of response_id
// It ensures that main responses (stream/text) appear before delayed messages (discovery, artifacts, pre-demo)
// and artifacts appear before discovery questions when both are delayed
// Incomplete stream messages are shown immediately along with their user message, while other messages wait for stream completion
export const messagesGroupedByResponseIdAndTimestamp = (messages: WebSocketMessage[]): WebSocketMessage[][] => {
  // Group messages by response_id
  const messageGroups = new Map<string, WebSocketMessage[]>();
  messages.forEach((msg) => {
    const group = messageGroups.get(msg.response_id) || [];
    group.push(msg);
    messageGroups.set(msg.response_id, group);
  });

  // Create a map to store the first occurrence index of each response_id
  const firstOccurrenceMap = new Map<string, number>();
  messages.forEach((msg, index) => {
    if (!firstOccurrenceMap.has(msg.response_id)) {
      firstOccurrenceMap.set(msg.response_id, index);
    }
  });

  // Sort groups by their first occurrence
  const sortedGroups = Array.from(messageGroups.entries()).sort(([aId, _], [bId, __]) => {
    const aFirstIndex = firstOccurrenceMap.get(aId) || 0;
    const bFirstIndex = firstOccurrenceMap.get(bId) || 0;
    return aFirstIndex - bFirstIndex;
  });

  // Process each group
  const result: WebSocketMessage[][] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, groupMessages] of sortedGroups) {
    const incompleteMessages = getIncompleteGroupMessages(groupMessages);
    const checkMessageGroupReady = isMessageGroupReady(groupMessages);
    if (checkMessageGroupReady) {
      // If stream is complete or there's no stream, show all messages in order
      result.push(sortMessageGroup(groupMessages));
    } else if (incompleteMessages.length > 0) {
      // If there's an incomplete stream, show user message and stream message
      result.push(incompleteMessages);
    }
  }

  return result;
};

// Check if the current AI stream message is complete, given the last message response id
export const checkIsCurrentMessageComplete = (messages: WebSocketMessage[], lastMessageResponseId: string) => {
  return (
    messages.filter(
      (message) =>
        message.role === MessageSenderRole.AI &&
        message.response_id === lastMessageResponseId &&
        message.message_type === 'STREAM' &&
        isStreamMessageComplete(message),
    ).length > 0
  );
};

export const checkIfCTAButtonDisabled = (messages: WebSocketMessage[]) => {
  const primaryGoalCtaClickedMessage = messages.find((message) => isPrimaryGoalCTAClickedMessage(message));
  if (!primaryGoalCtaClickedMessage) return false;

  const qualificationFormMessage = messages.find(
    (
      message,
    ): message is WebSocketMessage & {
      message: ArtifactMessageContent & { artifact_data: FormArtifactContent };
    } => checkIsQualificationFormArtifact(message) && message.response_id === primaryGoalCtaClickedMessage.response_id,
  );
  if (!qualificationFormMessage) return false;

  const qualificationFormFilledMessage = getFormFilledEventByArtifactId(
    messages,
    qualificationFormMessage,
    QUALIFICATION_FORM_FILLED,
  );

  return !qualificationFormFilledMessage;
};

export const checkIfCTAButtonShown = (messages: WebSocketMessage[]) => {
  const isFormFilledEventMessageExist = checkIfFormFilledMessageExists(messages, FORM_FILLED);
  const isQualificationFormFiledEventMessageExist = checkIfFormFilledMessageExists(messages, QUALIFICATION_FORM_FILLED);

  const isQualificationFormArtifact = messages.find((message) => checkIsQualificationFormArtifact(message));
  if (isFormFilledEventMessageExist && !isQualificationFormArtifact) return false;

  if (isQualificationFormFiledEventMessageExist) return false;

  return true;
};

/**
 * Determines if a single message will render any HTML on screen
 * @param message - The WebSocket message to check
 * @returns Boolean indicating if the message will render HTML
 */
export const willMessageRenderHTML = (message: WebSocketMessage): boolean => {
  // Admin messages always render
  if (checkIsAdminJoinedMessage(message) || checkIsAdminLeftMessage(message) || checkIsUserLeftMessage(message))
    return true;

  // Discovery answers always render
  if (isDiscoveryAnswer(message)) return true;

  // CTA events always render
  if (isCtaEvent(message, 'left')) return true;

  // Demo options always render
  if (isDemoOptionsMessage(message)) return true;

  // Discovery questions always render
  if (isDiscoveryQuestion(message)) return true;

  // Text messages with content render
  if (isDisplayedAsTextMessage(message) && message.message.content !== '') return true;

  // Artifact messages render (except suggestions which need additional context)
  if (checkIsArtifactMessage(message)) {
    // Suggestions need additional context to determine rendering, so we default to true
    // and let the consuming component decide. Other artifacts are always rendered.
    return true;
  }

  return false;
};
