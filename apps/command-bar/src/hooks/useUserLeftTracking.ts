import { useEffect, useRef } from 'react';
import { useCommandBarStore } from '@neuraltrade/shared/stores';
import { useCommandBarAnalytics } from '@neuraltrade/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import { Message, MessageEventType } from '@neuraltrade/shared/types/message';

/**
 * Custom hook to track USER_LEFT events when the browser tab is closed
 * Only sends the event if there's at least one AI message in the conversation
 */
export const useUserLeftTracking = (sendUserMessage: (message: string, overrides?: Partial<Message>) => void) => {
  const { messages } = useCommandBarStore();
  const { trackEvent } = useCommandBarAnalytics();
  const hasTrackedRef = useRef(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentMessages = messagesRef.current;
      const { ai_message_count, user_message_count } = currentMessages.reduce(
        (counts, msg) => ({
          ai_message_count: counts.ai_message_count + (msg.role === 'ai' ? 1 : 0),
          user_message_count: counts.user_message_count + (msg.role === 'user' ? 1 : 0),
        }),
        { ai_message_count: 0, user_message_count: 0 },
      );
      // Check if we have at least one AI message
      const hasAIMessage = currentMessages.some((message) => message.role === 'ai');

      // Only track if we have AI messages and haven't already tracked
      if (hasAIMessage && !hasTrackedRef.current) {
        hasTrackedRef.current = true;

        try {
          sendUserMessage('', {
            event_type: MessageEventType.USER_LEFT,
          });
          trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.USER_LEFT, {
            message_count: currentMessages.length,
            ai_message_count,
            user_message_count,
          });
        } catch (error) {
          console.warn('Failed to track and send USER_LEFT event:', error);
        }
      }
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Reset tracking flag when messages change significantly (new session)
  useEffect(() => {
    messagesRef.current = messages;
    // If messages are cleared or reset, allow tracking again
    if (messages.length === 0) {
      hasTrackedRef.current = false;
    }
  }, [messages.length]);
};
