import { Message } from '../types/message';

/**
 * Special event types that should stay with the previous message group
 * These events don't represent new conversation responses but rather system events
 */
const SPECIAL_EVENTS = ['USER_LEFT', 'USER_INACTIVE', 'HEARTBEAT', 'HEARTBEAT_ACK'];

/**
 * Groups messages by response_id into a 2D array
 * Each child array contains all messages belonging to one response_id
 * The parent array contains all such grouped arrays
 */
export const groupMessagesByResponseId = (messages: Message[]): Message[][] => {
  const groupedMessages: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    // Special events that should stay with the previous group
    const isSpecialEvent = SPECIAL_EVENTS.includes(message.event_type);

    // For special events, use the previous message's response_id if available
    const responseId =
      isSpecialEvent && Object.keys(groupedMessages).length > 0
        ? Object.keys(groupedMessages)[Object.keys(groupedMessages).length - 1]
        : message.response_id;

    if (!groupedMessages[responseId]) {
      groupedMessages[responseId] = [];
    }
    groupedMessages[responseId].push(message);
  });

  // Convert to 2D array and sort each group according to the specified order
  return Object.values(groupedMessages).map((group) => {
    return group.sort((a, b) => {
      // User messages should always come first
      if (a.role === 'user' && b.role !== 'user') {
        return -1;
      }
      if (a.role !== 'user' && b.role === 'user') {
        return 1;
      }

      // If both are user messages, sort by timestamp
      if (a.role === 'user' && b.role === 'user') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }

      // For AI messages, use priority-based ordering
      const getMessageOrder = (message: Message): number => {
        // For AI messages, use priority-based ordering
        const getEventPriority = (message: Message): number => {
          // Stream responses - need to handle multiple in same group
          if (message.event_type === 'STREAM_RESPONSE') {
            // Check if this is the first stream response in the group
            const streamResponsesInGroup = group.filter((msg) => msg.event_type === 'STREAM_RESPONSE');
            const isFirstStream = streamResponsesInGroup.indexOf(message) === 0;

            // If this is not the first stream, check if there are form events between streams
            if (!isFirstStream) {
              const messageIndex = group.indexOf(message);
              const previousStreamIndex = group.findIndex(
                (msg, index) => index < messageIndex && msg.event_type === 'STREAM_RESPONSE',
              );

              if (previousStreamIndex !== -1) {
                // Check if there are form events between the previous stream and this one
                const messagesBetweenStreams = group.slice(previousStreamIndex + 1, messageIndex);
                const hasFormEventsBetween = messagesBetweenStreams.some(
                  (msg) =>
                    msg.event_type === 'FORM_FILLED' ||
                    msg.event_type === 'QUALIFICATION_FORM_FILLED' ||
                    msg.event_type === 'CALENDAR_SUBMIT',
                );

                if (hasFormEventsBetween) {
                  // If there are form events between, treat this as a new stream (priority 1)
                  return 1;
                }

                // Check if this is the same stream content being updated (same content, different is_complete)
                const previousStream = group[previousStreamIndex];
                const previousContent = (previousStream.event_data as { content?: string })?.content;
                const currentContent = (message.event_data as { content?: string })?.content;

                if (previousContent === currentContent) {
                  // Same content, different is_complete - treat as same stream, use same priority
                  return 1;
                }
              }
            }

            return isFirstStream ? 1 : 4; // First stream = 1, subsequent streams = 4
          }

          // Artifacts (form, calendar, video, image, suggestions, etc.)
          if (
            [
              'FORM_ARTIFACT',
              'VIDEO_ARTIFACT',
              'SLIDE_IMAGE_ARTIFACT',
              'SUGGESTIONS_ARTIFACT',
              'GENERATING_ARTIFACT',
            ].includes(message.event_type)
          ) {
            // Video and image artifacts should appear immediately after text content
            if (message.event_type === 'VIDEO_ARTIFACT' || message.event_type === 'SLIDE_IMAGE_ARTIFACT') {
              return 1.5; // Between first stream (1) and other artifacts (2)
            }
            return 2; // Other artifacts = 2
          }

          // Qualification questions
          if (message.event_type === 'DISCOVERY_QUESTIONS' || message.event_type === 'QUALIFICATION_FORM_ARTIFACT') {
            return 3;
          }

          if (message.event_type === 'CALENDAR_ARTIFACT') {
            return 4;
          }

          // Other AI messages (TEXT_RESPONSE, etc.)
          return 5; // Other AI messages = 5
        };

        return getEventPriority(message);
      };

      const orderA = getMessageOrder(a);
      const orderB = getMessageOrder(b);

      // First sort by priority order
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Then sort by timestamp for consistent ordering
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  });
};

/**
 * Gets the latest message from each response group
 * Useful for determining the current state of each conversation thread
 */
export const getLatestMessageFromEachGroup = (groupedMessages: Message[][]): Message[] => {
  return groupedMessages.map((group) => {
    // Sort by timestamp to get the latest message in each group
    const sortedGroup = [...group].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sortedGroup[sortedGroup.length - 1];
  });
};

/**
 * Checks if a message group is complete (has a final response)
 */
export const isMessageGroupComplete = (messageGroup: Message[]): boolean => {
  return messageGroup.some(
    (message) =>
      message.event_type === 'STREAM_RESPONSE' &&
      message.event_data &&
      'is_complete' in message.event_data &&
      message.event_data.is_complete === true,
  );
};

/**
 * Gets the response ID for a message group
 */
export const getResponseIdFromGroup = (messageGroup: Message[]): string => {
  return messageGroup[0]?.response_id || '';
};

/**
 * Extracts the event type from a message, handling both flat and nested WebSocket message structures
 * @param message - The message object to extract event type from
 * @returns The event type string or empty string if not found
 */
export const extractMessageEventType = (message: Message): string => {
  // Handle flat message structure (direct event_type property)
  if (message.event_type) {
    return message.event_type;
  }

  // Handle WebSocketMessage structure for STREAM messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((message as any).message_type === 'STREAM') {
    return 'STREAM_RESPONSE';
  }

  // Handle WebSocketMessage structure for ARTIFACT messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((message as any).message_type === 'ARTIFACT' && (message as any).message?.artifact_type) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${(message as any).message.artifact_type}_ARTIFACT`;
  }

  // Handle WebSocketMessage structure for EVENT messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((message as any).message_type === 'EVENT' && (message as any).message?.event_type) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (message as any).message.event_type;
  }

  return '';
};

/**
 * Extracts the event data from a message, handling both flat and nested WebSocket message structures
 * @param message - The message object to extract event data from
 * @returns The event data object or null if not found
 */
export const extractMessageEventData = (message: Message): Record<string, unknown> | null => {
  // Handle flat message structure (direct event_data property)
  if (message.event_data) {
    return message.event_data;
  }

  // Handle WebSocketMessage structure for STREAM messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((message as any).message_type === 'STREAM' && (message as any).message) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (message as any).message;
  }

  // Handle WebSocketMessage structure for ARTIFACT messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((message as any).message_type === 'ARTIFACT' && (message as any).message) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (message as any).message;
  }

  // Handle WebSocketMessage structure for EVENT messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((message as any).message_type === 'EVENT' && (message as any).message?.event_data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (message as any).message.event_data;
  }

  return null;
};

/**
 * Checks if a message is a JOIN_SESSION event
 * @param message - The message to check
 * @returns True if the message is a JOIN_SESSION event
 */
export const isJoinSessionEvent = (message: Message): boolean => {
  const eventType = extractMessageEventType(message);
  return (
    eventType === 'JOIN_SESSION' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'JOIN_SESSION')
  );
};

/**
 * Checks if a message is a LEAVE_SESSION event
 * @param message - The message to check
 * @returns True if the message is a LEAVE_SESSION event
 */
export const isLeaveSessionEvent = (message: Message): boolean => {
  const eventType = extractMessageEventType(message);
  return (
    eventType === 'LEAVE_SESSION' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'LEAVE_SESSION')
  );
};

/**
 * Checks if a message is an ADMIN_RESPONSE event
 * @param message - The message to check
 * @returns True if the message is an ADMIN_RESPONSE event
 */
export const isAdminResponseEvent = (message: Message): boolean => {
  const eventType = extractMessageEventType(message);
  return (
    eventType === 'ADMIN_RESPONSE' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'ADMIN_RESPONSE')
  );
};

/**
 * Identifies admin session blocks from messages
 * @param messages - Array of messages to analyze
 * @returns Array of admin session blocks with start and end indices
 */
export const identifyAdminSessionBlocks = (messages: Message[]): Array<{ startIndex: number; endIndex: number }> => {
  const blocks: Array<{ startIndex: number; endIndex: number }> = [];
  let currentBlockStart: number | null = null;

  messages.forEach((message, index) => {
    if (isJoinSessionEvent(message)) {
      currentBlockStart = index;
    } else if (isLeaveSessionEvent(message) && currentBlockStart !== null) {
      blocks.push({ startIndex: currentBlockStart, endIndex: index });
      currentBlockStart = null;
    }
  });

  // Handle case where admin session is still active (no LEAVE_SESSION event)
  if (currentBlockStart !== null) {
    blocks.push({ startIndex: currentBlockStart, endIndex: messages.length - 1 });
  }

  return blocks;
};

/**
 * Determines if the current session state should show online indicator
 * Shows indicator if there's a JOIN_SESSION event without a subsequent LEAVE_SESSION
 * @param messages - Array of all messages in chronological order
 * @returns True if online indicator should be shown
 */
export const shouldShowSessionIndicator = (messages: Message[]): boolean => {
  // Iterate backwards from the end of the array to find the last relevant session event.
  // This is more efficient than iterating from the start.
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (isJoinSessionEvent(message)) {
      return true; // Last event was a join, so the session is active.
    }
    if (isLeaveSessionEvent(message)) {
      return false; // Last event was a leave, so the session is not active.
    }
  }

  // If no session events are found, the session is not active.
  return false;
};

/**
 * Groups messages by response_id, handling admin sessions as special groups
 * @param messages - Array of messages to group
 * @returns Array of message groups
 */
export const groupMessagesWithAdminSessions = (messages: Message[]): Message[][] => {
  if (messages.length === 0) return [];

  const adminSessionBlocks = identifyAdminSessionBlocks(messages);
  const groups: Message[][] = [];
  let currentIndex = 0;

  // Process each admin session block
  adminSessionBlocks.forEach(({ startIndex, endIndex }) => {
    // Add any messages before this admin session block
    if (currentIndex < startIndex) {
      const messagesBeforeAdminSession = messages.slice(currentIndex, startIndex);
      const regularGroups = groupMessagesByResponseId(messagesBeforeAdminSession);
      groups.push(...regularGroups);
    }

    // Add the admin session group
    const adminSessionMessages = messages.slice(startIndex, endIndex + 1);
    groups.push(adminSessionMessages);

    currentIndex = endIndex + 1;
  });

  // Add any remaining messages after the last admin session
  if (currentIndex < messages.length) {
    const remainingMessages = messages.slice(currentIndex);
    const regularGroups = groupMessagesByResponseId(remainingMessages);
    groups.push(...regularGroups);
  }

  return groups;
};
