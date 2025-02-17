import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { isGeneratingArtifactEvent, filterOutSuggestions } from '@meaku/core/utils/messageUtils';

interface State {
  messages: WebSocketMessage[];
  latestResponseId: string;
  setLatestResponseId: (latestResponseId: string) => void;
  setMessages: (messages: WebSocketMessage[]) => void;
  isAMessageBeingProcessed: false | true;
  setIsAMessageBeingProcessed: (isAMessageBeingProcessed: boolean) => void;
  handleAddAIMessage: (response: WebSocketMessage) => void;
  handleAddUserMessage: (message: WebSocketMessage) => void;
  handleRemoveMessages: (messageIds: string[]) => void;
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
  orbState: OrbStatusEnum;
  handleUpdateOrbState: (selectedOrbState: OrbStatusEnum) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setMediaTakeFullScreenWidth: (value: boolean | ((prevState: boolean) => boolean)) => void;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
}

export const useMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      messages: [] as WebSocketMessage[],
      latestResponseId: '',
      setLatestResponseId: (latestResponseId: string) =>
        set((draft) => {
          draft.latestResponseId = latestResponseId;
        }),
      setMessages: (messages) =>
        set((draft) => {
          draft.messages = messages.filter(
            (message) =>
              !(
                message.message_type === 'EVENT' &&
                'event_type' in message.message &&
                message.message.event_type === 'GENERATING_ARTIFACT'
              ),
          );
        }),
      isAMessageBeingProcessed: false as const,
      setIsAMessageBeingProcessed: (isAMessageBeingProcessed) =>
        set((draft) => {
          draft.isAMessageBeingProcessed = isAMessageBeingProcessed;
        }),
      demoPlayingStatus: DemoPlayingStatus.INITIAL,
      setDemoPlayingStatus: (demoPlayingStatus) =>
        set((draft) => {
          draft.demoPlayingStatus = demoPlayingStatus;
        }),
      handleAddAIMessage: (message: WebSocketMessage) =>
        set((draft) => {
          // Don't add GENERATING_ARTIFACT event messages
          if (isGeneratingArtifactEvent(message)) {
            return;
          }

          // Find existing message to update
          const existingMessageIndex = draft.messages.findIndex(
            (msg) =>
              msg.role === 'ai' &&
              msg.response_id === message.response_id &&
              // For TEXT/STREAM messages, only check response_id to allow replacing orb state text
              (message.message_type === 'TEXT' || message.message_type === 'STREAM'
                ? true
                : // For other message types (like ARTIFACT), check both message_type and artifact_type
                  msg.message_type === message.message_type &&
                  (msg.message_type !== 'ARTIFACT' ||
                    ('artifact_type' in msg.message &&
                      'artifact_type' in message.message &&
                      msg.message.artifact_type === message.message.artifact_type))),
          );

          if (existingMessageIndex !== -1) {
            draft.messages[existingMessageIndex] = {
              ...draft.messages[existingMessageIndex],
              ...message,
            };
          } else {
            draft.messages.push(message);
          }
        }),
      handleAddUserMessage: (message) =>
        set((draft) => {
          // Remove previous suggestions when user sends a message
          draft.messages = filterOutSuggestions(draft.messages);
          draft.messages.push(message);
          draft.latestResponseId = message.response_id;
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
      handleRemoveMessages: (messageIds) =>
        set((draft) => {
          draft.messages = draft.messages.filter((message) => !messageIds.includes(message.response_id));
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
