import { AIResponse, Message } from "@meaku/core/types/chat";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  messages: Message[];
  setMessages: (messages: Message[], welcomeMessage: string) => void;
  suggestedQuestions: string[];
  setSuggestedQuestions: (suggestedQuestions: string[]) => void;
  isAMessageBeingProcessed: boolean;
  setIsAMessageBeingProcessed: (isAMessageBeingProcessed: boolean) => void;
  handleAddAIMessage: (response: AIResponse) => void;
  handleAddUserMessage: (message: string) => void;
}

export const useMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      messages: [],
      setMessages: (messages, welcomeMessage) =>
        set((draft) => {
          let updatedMessages = [...messages];

          updatedMessages.splice(0, 0, {
            role: "ai",
            message: welcomeMessage,
            media: null,
            documents: [],
            id: nanoid(),
          });

          updatedMessages = updatedMessages.map((message) => ({
            ...message,
            isPartOfHistory: true,
          }));

          draft.messages = updatedMessages;
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
          const messageId = response.response_id;

          const existingMessageIndex = draft.messages.findIndex(
            (message) => message.id === messageId,
          );

          if (existingMessageIndex !== -1) {
            draft.messages[existingMessageIndex] = {
              ...draft.messages[existingMessageIndex],
              message: response.message,
              media: response.media,
              documents: response.documents,
              is_loading: response.is_loading,
            };
          } else {
            draft.messages.push({
              id: messageId,
              role: "ai",
              message: response.message,
              media: response.media,
              documents: response.documents,
              is_loading: response.is_loading,
            });
          }
        }),
      handleAddUserMessage: (message) =>
        set((draft) => {
          draft.messages.push({
            id: nanoid(),
            role: "user",
            message,
            media: null,
            documents: [],
          });
        }),
    })),
  ),
);
