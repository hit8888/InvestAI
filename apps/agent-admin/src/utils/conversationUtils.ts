import { WebSocketMessage, EventMessageContent } from '@neuraltrade/core/types/webSocketData';
import { checkIsAdminJoinedMessage, checkIsAdminLeftMessage } from '@neuraltrade/core/utils/messageUtils';

/**
 * Gets the active user ID from JOIN events in the conversation.
 *
 * @param chatHistory - Array of WebSocket messages from the conversation
 * @returns Object with hasActiveJoin flag and activeUserId (whoever is actively in the chat)
 */
export const getActiveJoinUser = (
  chatHistory: WebSocketMessage[],
): { hasActiveJoin: boolean; activeUserId: number | undefined } => {
  const adminSessionEvents = chatHistory.filter(
    (message) => checkIsAdminJoinedMessage(message) || checkIsAdminLeftMessage(message),
  );

  // Iterate backwards, tracking if we've seen a LEAVE after the current position
  let hasSeenLeave = false;
  for (let i = adminSessionEvents.length - 1; i >= 0; i--) {
    const event = adminSessionEvents[i];

    if (checkIsAdminLeftMessage(event)) {
      hasSeenLeave = true;
    } else if (checkIsAdminJoinedMessage(event)) {
      const joinEventData = (event.message as Extract<EventMessageContent, { event_type: 'JOIN_SESSION' }>).event_data;
      const joinUserId = 'user_id' in joinEventData ? joinEventData.user_id : undefined;

      // If no LEAVE seen after this JOIN, it's active
      if (!hasSeenLeave) {
        return { hasActiveJoin: true, activeUserId: joinUserId };
      }

      // Reset for next JOIN (if we go further back)
      hasSeenLeave = false;
    }
  }

  return { hasActiveJoin: false, activeUserId: undefined };
};
