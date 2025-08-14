import {
  StreamMessageContent,
  BaseMessageContent,
  CtaEventDataContent,
  ArtifactFormType,
  FormFilledEventType,
} from './types';
import { ArtifactContent, CalendarArtifactContent, FormArtifactContent } from './artifact';
import DateUtil from './dateUtils';
import { MessageViewType, ViewType } from './enum';
import { Message, MessageEventType, MessageRole, MessageRoleType, ArtifactMessageContent } from '../types/message';

const { FORM_FILLED, QUALIFICATION_FORM_FILLED, CALENDAR_SUBMIT, GENERATING_ARTIFACT } = MessageEventType;
export const USER_EVENTS_NOT_FOR_SCROLL_TO_TOP = ['HEARTBEAT', 'USER_INACTIVE'];

export const BASE_ARTIFACT_TYPES = ['SLIDE', 'SLIDE_IMAGE', 'VIDEO', 'FORM', 'CALENDAR'] as const;
export const SUPPORTED_ARTIFACT_TYPES = [...BASE_ARTIFACT_TYPES] as const;
export type SupportedArtifactType = (typeof SUPPORTED_ARTIFACT_TYPES)[number];

export const getMessagesWithSameResponseId = (messages: Message[], responseId: string) => {
  return messages.filter((msg) => msg.response_id === responseId);
};

export const isHumanMessageInDashboardView = (messageViewType: MessageViewType) => {
  return [MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW, MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW].includes(
    messageViewType,
  );
};

// Check if the current AI stream message is complete, given the last message response id
export const checkIsCurrentMessageComplete = (messages: Message[], lastMessageResponseId: string) => {
  return (
    messages.filter(
      (message) =>
        message.role === MessageRole.AI &&
        message.response_id === lastMessageResponseId &&
        message.event_type === MessageEventType.STREAM_RESPONSE &&
        isStreamMessageComplete(message),
    ).length > 0
  );
};

export const isDisplayedAsTextMessage = (message: Message): boolean => {
  return (
    message.event_type === MessageEventType.TEXT_RESPONSE ||
    message.event_type === MessageEventType.TEXT_REQUEST ||
    message.event_type === MessageEventType.STREAM_RESPONSE ||
    message.event_type === MessageEventType.SUGGESTED_QUESTION_CLICKED ||
    message.event_type === MessageEventType.BOOK_MEETING ||
    checkIsLoadingTextMessage(message)
  );
};

export const isDemoOptionsMessage = (message: Message): boolean => {
  return message.role === MessageRole.AI && message.event_type === MessageEventType.DEMO_OPTIONS;
};

export const checkIsAIMessage = (message: Message): boolean => {
  return message.role === MessageRole.AI;
};

export const isDiscoveryAnswer = (message: Message): boolean => {
  return message.event_type === MessageEventType.DISCOVERY_ANSWER;
};

export const checkIsAdminJoinedMessage = (message: Message): boolean => {
  return message.event_type === MessageEventType.JOIN_SESSION;
};

export const checkIsAdminLeftMessage = (message: Message): boolean => {
  return message.event_type === MessageEventType.LEAVE_SESSION;
};

export const isStreamMessage = (message: Message): message is Message & { message: StreamMessageContent } => {
  return message.event_type === MessageEventType.STREAM_RESPONSE && message.actor === 'SALES';
};

export const isTextMessage = (message: Message): message is Message & { message: BaseMessageContent } => {
  return message.event_type === MessageEventType.TEXT_RESPONSE;
};

export const isDiscoveryQuestion = (message: Message): boolean => {
  return message.event_type === MessageEventType.DISCOVERY_QUESTIONS && message.actor === 'DISCOVERY_QUESTIONS';
};

export const checkIsArtifactMessage = (message: Message) => {
  return (
    'artifact_data' in message.event_data &&
    'artifact_type' in message.event_data &&
    (isMediaArtifact(message.event_data.artifact_type) || isSuggestionArtifact(message))
  );
};

export const isCtaEvent = (
  message: Message,
  align?: CtaEventDataContent['align'],
): message is Message & {
  event_data: CtaEventDataContent;
} => {
  return message?.event_type === 'CTA_EVENT' && (!align || message.event_data?.align === align);
};

// Type guard for Message with is_complete
export const isStreamMessageComplete = (message: Message): boolean => {
  return (
    isStreamMessage(message) &&
    'is_complete' in message.event_data &&
    typeof message.event_data.is_complete === 'boolean' &&
    message.event_data.is_complete
  );
};

export const checkIsLoadingTextMessage = (
  message: Message,
): message is Message & { event_data: { content: string } } => {
  return message.event_type === 'LOADING_TEXT' && typeof message.event_data.content === 'string';
};

export const isSuggestionArtifact = (msg: Message) => msg.event_type === MessageEventType.SUGGESTIONS_ARTIFACT;

export const isMediaArtifact = (type: string): type is SupportedArtifactType => {
  return SUPPORTED_ARTIFACT_TYPES.includes(type as SupportedArtifactType);
};

export const isCalendarArtifact = (msg: Message) => msg.event_type === MessageEventType.CALENDAR_ARTIFACT;

export const checkIsMainResponseMessage = (message: Message): boolean => {
  // isSuggestionArtifact(message) is added - bcoz we also show the suggestions when inactive event is send and we receive suggestions artifact
  return (
    (message.actor === 'SALES' && (isStreamMessage(message) || isTextMessage(message))) ||
    (message.actor === 'ARTIFACT' &&
      (isTextMessage(message) || isCalendarArtifact(message) || isSuggestionArtifact(message))) //Being used for form acknowledgement
  );
};

export const checkIsSalesResponseComplete = (messagesWithSameResponseId: Message[]): boolean => {
  return messagesWithSameResponseId.some(
    (message) =>
      checkIsMainResponseMessage(message) &&
      (isStreamMessageComplete(message) ||
        isTextMessage(message) ||
        isSuggestionArtifact(message) ||
        isCalendarArtifact(message)),
  );
};

export const checkIsQualificationFormArtifact = (message: Message): boolean => {
  if (!checkIsFormArtifactBase(message)) return false;
  const content = message.event_data?.artifact_data.content;
  return content !== null && 'qualification' in content && Boolean(content.qualification);
};

export const findArtifactMessageWithSameArtifactId = (messages: Message[], artifactId: string) => {
  return messages.find(
    (
      message,
    ): message is Message & {
      event_data: ArtifactMessageContent & { artifact_data: ArtifactContent | FormArtifactContent };
    } => {
      if (message.role !== 'ai' || !checkIsArtifactMessage(message)) return false;
      const artifactData = (message.event_data as ArtifactMessageContent).artifact_data;
      return artifactData.artifact_id === artifactId;
    },
  );
};

export const getCalendarArtifactMessage = (messagesWithSameResponseId: Message[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactMessageContent & {
        artifact_data: CalendarArtifactContent;
      };
    } => checkIsArtifactMessage(msg) && msg.event_type === 'CALENDAR_ARTIFACT' && 'artifact_data' in msg.event_data,
  );
};

export const getCtaEvent = (
  messages: Message[],
  responseId?: string | undefined,
  align?: CtaEventDataContent['align'],
) => {
  return messages.find(
    (
      msg,
    ): msg is Message & {
      event_data: CtaEventDataContent;
    } => isCtaEvent(msg, align) && (!responseId || msg.response_id === responseId),
  );
};

// Check if the artifact message is a form
export const checkIsFormArtifactBase = (
  message: Message,
): message is Message & { event_data: ArtifactMessageContent } => {
  return (
    checkIsArtifactMessage(message) &&
    message.event_type === 'FORM_ARTIFACT' &&
    !!message.event_data.artifact_data?.content
  );
};

export const getFormArtifactMessage = (messagesWithSameResponseId: Message[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactMessageContent & {
        artifact_data: FormArtifactContent;
      };
    } => checkIsFormArtifactBase(msg),
  );
};

export const isGeneratingMediaArtifactEvent = (message: Message) =>
  'event_type' in message &&
  message.event_type === GENERATING_ARTIFACT &&
  isMediaArtifact(message.event_data.artifact_type);

// Helper function to check if a message is a main response (stream or text)
const isMainResponse = (message: Message): boolean => {
  return isStreamMessage(message) || isTextMessage(message);
};

// Helper function to check if a message should be delayed (discovery, artifact)
const isDelayedMessage = (message: Message): boolean => {
  return isDiscoveryQuestion(message) || checkIsArtifactMessage(message) || isCtaEvent(message);
};

// Helper function to check if a group of messages with same response_id is ready to be shown
const isMessageGroupReady = (messages: Message[]): boolean => {
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
const getIncompleteGroupMessages = (messages: Message[]): Message[] => {
  const userMessage = messages.find((msg) => msg.role === MessageRole.USER);

  // For Nudge Message, TEXT Message with No actor key
  const nudgeMessage = messages.find((msg) => msg.role === MessageRole.AI && !msg.actor && isTextMessage(msg));

  const streamMessage = messages.find(isStreamMessage);
  const loadingMessage = messages.find((msg) => checkIsLoadingTextMessage(msg));

  const result: Message[] = [];
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

// This function, sortMessageGroup, takes an array of Message objects that all belong to the same group (for example, they share the same response_id).
// Its purpose is to sort these messages so that they are displayed in the correct order in the chat UI.
// The sorting rules are as follows:
// 1. Main response messages (like the main AI response) should always appear before "delayed" messages (such as discovery questions, artifacts, or CTA events).
// 2. If both messages are delayed, artifact messages should come before discovery questions.
//    - If both are artifact messages, media artifacts are prioritized over suggestion artifacts.
// 3. Messages that indicate a media artifact is being generated are not sorted with the others, but are instead appended at the end of the group.
// 4. For all other cases, the original order of the messages is preserved.
// The function returns a new array of messages, sorted according to these rules, ready to be rendered in the chat interface.
const sortMessageGroup = (messages: Message[]): Message[] => {
  const generatingArtifactMessages = messages.filter(isGeneratingMediaArtifactEvent);
  // messing up with sorting if message is of type media artifact generating
  const messagesToBeSorted = messages.slice().filter((msg) => !isGeneratingMediaArtifactEvent(msg));

  const resultantMessages = messagesToBeSorted.sort((a, b) => {
    // Always show user messages first
    if (a.role === 'user' && b.role !== 'user') return -1;
    if (a.role !== 'user' && b.role === 'user') return 1;

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
        const aIsMediaArtifact = aIsArtifact && isMediaArtifact((a.event_data as ArtifactMessageContent).artifact_type);
        const bIsMediaArtifact = bIsArtifact && isMediaArtifact((b.event_data as ArtifactMessageContent).artifact_type);
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
export const messagesGroupedByResponseIdAndTimestamp = (messages: Message[]): Message[][] => {
  // Group messages by response_id
  const messageGroups = new Map<string, Message[]>();
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
  const result: Message[][] = [];
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

/**
 * Determines if a single message will render any HTML on screen
 * @param message - The WebSocket message to check
 * @returns Boolean indicating if the message will render HTML
 */
export const willMessageRenderHTML = (message: Message): boolean => {
  // Admin messages always render
  if (checkIsAdminJoinedMessage(message) || checkIsAdminLeftMessage(message)) return true;

  // Discovery answers always render
  if (isDiscoveryAnswer(message)) return true;

  // CTA events always render
  if (isCtaEvent(message, 'left')) return true;

  // Demo options always render
  if (isDemoOptionsMessage(message)) return true;

  // Discovery questions always render
  if (isDiscoveryQuestion(message)) return true;

  // Text messages with content render
  if (isDisplayedAsTextMessage(message) && 'content' in message.event_data && message.event_data.content !== '')
    return true;

  // Artifact messages render (except suggestions which need additional context)
  if (checkIsArtifactMessage(message)) {
    // Suggestions need additional context to determine rendering, so we default to true
    // and let the consuming component decide. Other artifacts are always rendered.
    return true;
  }

  return false;
};

// User sends a message from Input
const isUserTextMessage = (message: Message): boolean => {
  return message.role === MessageRole.USER && message.event_type === MessageEventType.TEXT_REQUEST;
};

// User clicks on a suggestion or slide item
const isUserEventMessage = (message: Message): boolean => {
  return message.role === MessageRole.USER && !USER_EVENTS_NOT_FOR_SCROLL_TO_TOP.includes(message.event_type);
};

export const shouldMessageScrollToTop = (message: Message): boolean => {
  return isUserEventMessage(message) || isUserTextMessage(message);
};

export const checkMessageIsFormFilled = (msg: Message, eventType: FormFilledEventType) => {
  return (
    msg.event_type === eventType &&
    'event_data' in msg &&
    ((eventType === FORM_FILLED && 'form_data' in msg.event_data) ||
      (eventType === CALENDAR_SUBMIT && 'form_data' in msg.event_data) ||
      (eventType === QUALIFICATION_FORM_FILLED && 'qualification_responses' in msg.event_data))
  );
};

export const getFormFilledEventByArtifactId = (
  messages: Message[],
  formArtifactMessage:
    | (Message & {
        event_data: ArtifactMessageContent & {
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
    ): msg is Message & {
      event_data: ArtifactFormType;
    } =>
      'event_data' in msg &&
      'artifact_id' in msg.event_data &&
      formArtifactMessage.event_data.artifact_data.artifact_id === msg.event_data.artifact_id &&
      checkMessageIsFormFilled(msg, eventType),
  );
};

export const getMessageTimestamp = (timestamp?: string): string => {
  if (!timestamp) {
    return ''; // Return an empty string or a default value if timestamp is missing
  }

  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return ''; // Return an empty string or a default value if the date is invalid
  }

  // Convert to ISO string and format it
  return DateUtil.getDateValueInISOString(timestamp);
};

export function getMessageViewType(messageRole: MessageRoleType, viewType: ViewType): MessageViewType {
  if (messageRole === MessageRole.ADMIN) {
    switch (viewType) {
      case ViewType.ADMIN:
        return MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW;
      case ViewType.USER:
        return MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW;
      case ViewType.DASHBOARD:
        return MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW;
    }
  } else if (messageRole === MessageRole.USER) {
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

export const checkIfFormFilledMessageExists = (messages: Message[], eventType: FormFilledEventType) => {
  return messages.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactFormType;
    } => checkMessageIsFormFilled(msg, eventType),
  );
};

export const checkIfCTAButtonShown = (messages: Message[]) => {
  const isFormFilledEventMessageExist = checkIfFormFilledMessageExists(messages, FORM_FILLED);
  const isQualificationFormFiledEventMessageExist = checkIfFormFilledMessageExists(messages, QUALIFICATION_FORM_FILLED);

  const isQualificationFormArtifact = messages.find((message) => checkIsQualificationFormArtifact(message));
  if (isFormFilledEventMessageExist && !isQualificationFormArtifact) return false;

  if (isQualificationFormFiledEventMessageExist) return false;

  return true;
};
