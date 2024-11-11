import { AIResponse, Message } from '@meaku/core/types/chat';
import { Feedback } from '@meaku/core/types/session';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  // TODO: Remove Suggestion from here
  suggestedQuestions: string[];
  setSuggestedQuestions: (suggestedQuestions: string[]) => void;
  isAMessageBeingProcessed: boolean;
  setIsAMessageBeingProcessed: (isAMessageBeingProcessed: boolean) => void;
  handleAddAIMessage: (response: AIResponse) => void;
  handleAddUserMessage: (message: string) => void;
  handleAddMessageFeedback: (messageId: string, feedback: Partial<Feedback>) => void;
  handleRemoveMessageFeedback: (messageId: string, previousState?: Message) => void;
}

export const useMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      messages: [],
      setMessages: (messages) =>
        set((draft) => {
          draft.messages = messages;
        }),
      suggestedQuestions: [],
      setSuggestedQuestions: (suggestedQuestions) =>
        set((draft) => {
          draft.suggestedQuestions = suggestedQuestions;
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

          if (existingMessageIndex !== -1) {
            draft.messages[existingMessageIndex] = {
              ...draft.messages[existingMessageIndex],
              message: response.message,
              media: response.media,
              documents: response.documents,
              is_loading: response.is_loading,
              is_complete: response.is_complete,
              showFeedbackOptions: response.showFeedbackOptions,
              analytics: response.analytics,
            };
          } else {
            draft.messages.push({
              id: messageId,
              role: 'ai',
              message: response.message,
              media: response.media,
              documents: response.documents,
              is_loading: response.is_loading,
              is_complete: response.is_complete,
              showFeedbackOptions: response.showFeedbackOptions,
              analytics: response.analytics,
            });
          }
        }),
      handleAddUserMessage: (message) =>
        set((draft) => {
          draft.messages.push({
            id: nanoid(),
            role: 'user',
            message,
            media: null,
            documents: [],
            analytics: {},
          });
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
    })),
  ),
);
