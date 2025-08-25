import { Message } from '../types/message';

/**
 * Groups messages by response_id into a 2D array
 * Each child array contains all messages belonging to one response_id
 * The parent array contains all such grouped arrays
 */
export const groupMessagesByResponseId = (messages: Message[]): Message[][] => {
  const groupedMessages: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    const responseId = message.response_id;
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
            return 2; // Artifacts = 2
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

      // If orders are different, sort by order
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If orders are the same, maintain chronological order
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
