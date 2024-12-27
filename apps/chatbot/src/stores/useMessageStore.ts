import { AIResponse, Message } from '@meaku/core/types/chat';
import { Feedback } from '@meaku/core/types/session';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { OrbStatusEnum } from '@meaku/core/types/config';
import UnifiedSessionConfigResponseManager from '@meaku/core/managers/UnifiedSessionConfigResponseManager';

interface State {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isAMessageBeingProcessed: boolean;
  setIsAMessageBeingProcessed: (isAMessageBeingProcessed: boolean) => void;
  handleAddAIMessage: (response: AIResponse) => void;
  handleAddUserMessage: (message: string) => void;
  handleAddMessageFeedback: (messageId: string, feedback: Partial<Feedback>) => void;
  handleRemoveMessageFeedback: (messageId: string, previousState?: Message) => void;
  handleRemoveMessages: (messageIds: string[]) => void;
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
  orbState: OrbStatusEnum;
  handleUpdateOrbState: (selectedOrbState: OrbStatusEnum) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setMediaTakeFullScreenWidth: (value: boolean | ((prevState: boolean) => boolean)) => void;
}

export const useMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      messages: [],
      setMessages: (messages) =>
        set((draft) => {
          draft.messages = messages;
        }),
      isAMessageBeingProcessed: false,
      setIsAMessageBeingProcessed: (isAMessageBeingProcessed) =>
        set((draft) => {
          draft.isAMessageBeingProcessed = isAMessageBeingProcessed;
        }),
      handleAddAIMessage: (response) =>
        set((draft) => {
          const messageId = response.response_id; //AI response

          const existingMessageIndex = draft.messages.findIndex((message) => message.id === messageId);

          const messageInterface = UnifiedSessionConfigResponseManager.convertServerMessageToClientMessage(response);

          if (existingMessageIndex !== -1) {
            draft.messages[existingMessageIndex] = {
              ...draft.messages[existingMessageIndex],
              ...messageInterface,
            };
          } else {
            draft.messages.push(messageInterface);
          }
        }),
      handleAddUserMessage: (message) =>
        set((draft) => {
          draft.messages.push({
            id: nanoid(),
            role: 'user',
            message,
            documents: [],
            analytics: {},
          });
        }),
      isMediaTakingFullWidth: false,
      setMediaTakeFullScreenWidth: (value) =>
        set((draft) => {
          draft.isMediaTakingFullWidth = typeof value === 'function' ? value(draft.isMediaTakingFullWidth) : value;
        }),
      handleToggleFullScreen: () =>
        set((draft) => {
          draft.isMediaTakingFullWidth = !draft.isMediaTakingFullWidth;
        }),
      handleAddMessageFeedback: (messageId, feedback) =>
        set((draft) => {
          const messageIndex = draft.messages.findIndex((message) => message.id == messageId);

          if (messageIndex === -1) return;

          const existingFeedback = draft.messages[messageIndex].feedback;
          const updatedFeedback = {
            ...existingFeedback,
            ...feedback,
            positive_feedback: feedback.positive_feedback ?? false,
          };

          if (updatedFeedback.positive_feedback) delete updatedFeedback.category;

          draft.messages[messageIndex] = {
            ...draft.messages[messageIndex],
            feedback: updatedFeedback,
          };
        }),

      handleRemoveMessageFeedback: (messageId, previousState) =>
        set((draft) => {
          const messageIndex = draft.messages.findIndex((message) => message.id == messageId);

          if (messageIndex === -1) return;

          draft.messages[messageIndex] = {
            ...draft.messages[messageIndex],
            feedback: previousState?.feedback ?? undefined,
          };
        }),
      handleRemoveMessages: (messageIds) =>
        set((draft) => {
          draft.messages = draft.messages.filter((message) => !messageIds.includes(message.id as string));
        }),
      hasFirstUserMessageBeenSent: false,
      setHasFirstUserMessageBeenSent: (value) =>
        set((draft) => {
          draft.hasFirstUserMessageBeenSent = value;
        }),
      orbState: OrbStatusEnum.idle,
      handleUpdateOrbState: (selectedOrbState) =>
        set((draft) => {
          draft.orbState = selectedOrbState;
        }),
    })),
  ),
);
