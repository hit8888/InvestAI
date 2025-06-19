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
import { ArtifactContent, FormArtifactContent, MediaArtifactContent, SuggestionArtifactContent } from '../types';
import { MessageSenderRole, MessageViewType, ViewType } from '../types/common';

export const USER_EVENTS_NOT_FOR_SCROLL_TO_TOP = ['HEARTBEAT', 'USER_INACTIVE'];

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

export const isAIResponseInactiveMessage = (message: WebSocketMessage): boolean => {
  return (
    'event_type' in message.message &&
    message.message.event_type === 'USER_INACTIVE' &&
    message.role === 'ai' &&
    message.actor === 'EVENT' &&
    message.message_type === 'TEXT'
  );
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
  message.message.event_type === AgentEventType.GENERATING_ARTIFACT &&
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
export const BASE_ARTIFACT_TYPES = ['SLIDE', 'SLIDE_IMAGE', 'VIDEO', 'FORM', 'CALENDAR'] as const;
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
  return (
    (message.actor === 'SALES' && (isStreamMessage(message) || isTextMessage(message))) ||
    (message.actor === 'ARTIFACT' && isTextMessage(message)) || //Being used for form acknowledgement
    (message.actor === 'EVENT' && (isStreamMessage(message) || isTextMessage(message)))
  );
};

export const checkIsSalesResponseComplete = (messagesWithSameResponseId: WebSocketMessage[]): boolean => {
  return messagesWithSameResponseId.some(
    (message) =>
      checkIsMainResponseMessage(message) &&
      (isStreamMessageComplete(message) || isTextMessage(message) || isSuggestionArtifact(message)),
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
    | (WebSocketMessage & {
        message: ArtifactMessageContent & { artifact_data: ArtifactContent | FormArtifactContent };
      })
    | undefined
    | null,
  eventType: 'FORM_FILLED' | 'QUALIFICATION_FORM_FILLED',
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
      msg.message.event_type === eventType &&
      'event_data' in msg.message &&
      formArtifactMessage.message.artifact_data.artifact_id === msg.message.event_data.artifact_id &&
      ((eventType === 'FORM_FILLED' && 'form_data' in msg.message.event_data) ||
        (eventType === 'QUALIFICATION_FORM_FILLED' && 'qualification_responses' in msg.message.event_data)),
  );
};

export const isCtaEvent = (
  message: WebSocketMessage,
): message is WebSocketMessage & {
  message: EventMessageContent & {
    event_data: CtaEventDataContent;
  };
} => {
  return checkIsEventMessage(message) && message.message?.event_type === 'CTA_EVENT';
};

export const getCtaEvent = (messages: WebSocketMessage[], responseId: string | undefined, align: 'left' | 'right') => {
  return messages.find(
    (
      msg,
    ): msg is WebSocketMessage & {
      message: EventMessageContent & {
        event_data: CtaEventDataContent;
      };
    } => msg.response_id === responseId && isCtaEvent(msg) && msg.message?.event_data?.align === align,
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
  return isDiscoveryQuestion(message) || checkIsArtifactMessage(message);
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

// Helper function to sort messages within a group
const sortMessageGroup = (messages: WebSocketMessage[]): WebSocketMessage[] => {
  const resultantMessages = messages.slice().sort((a, b) => {
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

      // if both are artifacts, prioritize media artifacts over suggested questions
      if (aIsArtifact && bIsArtifact) {
        const aIsMediaArtifact = isMediaArtifact(a.message.artifact_type);
        const bIsMediaArtifact = isMediaArtifact(b.message.artifact_type);
        const aIsSuggestion = isSuggestionArtifact(a);
        const bIsSuggestion = isSuggestionArtifact(b);

        if (aIsMediaArtifact && bIsSuggestion) return -1;
        if (aIsSuggestion && bIsMediaArtifact) return 1;
      }

      if (aIsArtifact && bIsDiscovery) return -1;
      if (aIsDiscovery && bIsArtifact) return 1;
    }

    // For all other cases, maintain their original order
    return 0;
  });

  return resultantMessages;
};

// This function groups messages by response_id and then sorts them by the first occurrence of response_id
// It ensures that main responses (stream/text) appear before delayed messages (discovery, artifacts, pre-demo)
// and artifacts appear before discovery questions when both are delayed
// Incomplete stream messages are shown immediately along with their user message, while other messages wait for stream completion
export const messagesGroupedByResponseIdAndTimestamp = (messages: WebSocketMessage[]) => {
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
  const result: WebSocketMessage[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, groupMessages] of sortedGroups) {
    const incompleteMessages = getIncompleteGroupMessages(groupMessages);
    const checkMessageGroupReady = isMessageGroupReady(groupMessages);
    if (checkMessageGroupReady) {
      // If stream is complete or there's no stream, show all messages in order
      result.push(...sortMessageGroup(groupMessages));
    } else if (incompleteMessages.length > 0) {
      // If there's an incomplete stream, show user message and stream message
      result.push(...incompleteMessages);
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

  const qualificationFormFilledMessage = getFormFilledEvent(
    messages,
    qualificationFormMessage,
    'QUALIFICATION_FORM_FILLED',
  );

  return !qualificationFormFilledMessage;
};
