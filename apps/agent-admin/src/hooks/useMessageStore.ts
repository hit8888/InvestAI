import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { OrbStatusEnum } from '@neuraltrade/core/types/config';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { isDiscoveryQuestion, shouldUpdateMessage } from '@neuraltrade/core/utils/messageUtils';

interface State {
  messages: WebSocketMessage[];
  latestResponseId: string;
  setMessages: (messages: WebSocketMessage[]) => void;
  handleAddAIMessage: (response: WebSocketMessage) => void;
  handleAddUserMessage: (response: WebSocketMessage) => void;
  handleAddAdminMessage: (message: WebSocketMessage) => void;
  orbState: OrbStatusEnum;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setMediaTakeFullScreenWidth: (value: boolean | ((prevState: boolean) => boolean)) => void;
  aiSuggestionMessage: string;
  setAISuggestionMessage: (message: string) => void;
  isUserTyping: boolean;
}

const typingIndicatorTimeoutManager = (() => {
  let typingTimeoutId: NodeJS.Timeout | null = null;
  const TYPING_INDICATOR_TIMEOUT = 2000;

  const resetTypingTimeout = () => {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
  };

  const startTypingTimeout = (callback: () => void) => {
    typingTimeoutId = setTimeout(() => {
      callback();
      resetTypingTimeout();
    }, TYPING_INDICATOR_TIMEOUT);
  };

  return {
    resetTypingTimeout,
    startTypingTimeout,
  };
})();

export const useMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      messages: [] as WebSocketMessage[],
      latestResponseId: '',
      setMessages: (messages) =>
        set((state) => {
          state.messages = messages.filter(
            (message) =>
              !(
                message.message_type === 'EVENT' &&
                'event_type' in message.message &&
                message.message.event_type === 'GENERATING_ARTIFACT'
              ),
          );
        }),
      handleAddAIMessage: (message: WebSocketMessage) =>
        set((state) => {
          if (
            (message.message_type === 'EVENT' && message.message?.event_type === 'USER_TYPING') ||
            ('event_type' in message && message.event_type === 'USER_TYPING')
          ) {
            typingIndicatorTimeoutManager.resetTypingTimeout();
            state.isUserTyping = true;
            typingIndicatorTimeoutManager.startTypingTimeout(() => {
              set((state) => {
                state.isUserTyping = false;
              });
            });

            return;
          } else {
            state.isUserTyping = false;
          }

          const isDiscoveryMessage = isDiscoveryQuestion(message);
          const latestResponseId = state.latestResponseId;

          // If the message is a discovery message and the latest response id is not the same as the message response id, return
          if (isDiscoveryMessage && latestResponseId !== message.response_id) {
            return;
          }
          // Find existing message to update
          const existingMessageIndex = state.messages.findIndex((msg) => shouldUpdateMessage(msg, message));

          if (existingMessageIndex !== -1) {
            state.messages[existingMessageIndex] = {
              ...state.messages[existingMessageIndex],
              ...message,
            };
          } else {
            state.messages.push(message);
          }
        }),
      handleAddUserMessage: (message) =>
        set((state) => {
          state.messages.push(message);
          state.latestResponseId = message.response_id;
        }),
      handleAddAdminMessage: (message) =>
        set((state) => {
          state.messages.push(message);
          state.latestResponseId = message.response_id;
        }),
      isMediaTakingFullWidth: false,
      setMediaTakeFullScreenWidth: (value) =>
        set((state) => {
          state.isMediaTakingFullWidth = typeof value === 'function' ? value(state.isMediaTakingFullWidth) : value;
        }),
      handleToggleFullScreen: () =>
        set((state) => {
          state.isMediaTakingFullWidth = !state.isMediaTakingFullWidth;
        }),
      orbState: OrbStatusEnum.idle,
      aiSuggestionMessage: '',
      isUserTyping: false,
      setAISuggestionMessage: (message: string) =>
        set((state) => {
          state.aiSuggestionMessage = message;
        }),
    })),
  ),
);
