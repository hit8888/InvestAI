import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { AdminConversationJoinStatus, DemoPlayingStatus, MessageSenderRole } from '@meaku/core/types/common';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import {
  isDiscoveryQuestion,
  filterOutSuggestions,
  shouldUpdateMessage,
  filterMessagesWithoutSessionId,
} from '@meaku/core/utils/messageUtils';
import { MESSAGE_STATE } from '@meaku/core/utils/index';

const { FIRST_WELCOME_USER } = MESSAGE_STATE;

interface State {
  messages: WebSocketMessage[];
  latestResponseId: string;
  setLatestResponseId: (latestResponseId: string) => void;
  setMessages: (messages: WebSocketMessage[]) => void;
  isAMessageBeingProcessed: boolean;
  setIsAMessageBeingProcessed: (isAMessageBeingProcessed: boolean) => void;
  handleAddAIMessage: (response: WebSocketMessage) => void;
  handleAddUserMessage: (message: WebSocketMessage) => void;
  adminJoinStatus: AdminConversationJoinStatus;
  setAdminJoinStatus: (status: AdminConversationJoinStatus) => void;
  latestAdminMessageResponseId: string;
  handleAddAdminMessage: (response: WebSocketMessage) => void;
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
    immer(
      (set) =>
        ({
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

              const hasAdminJoined = messages.some(
                (message) =>
                  message.role === MessageSenderRole.ADMIN &&
                  message.message_type === 'EVENT' &&
                  message.message.event_type === 'JOIN_SESSION',
              );

              if (hasAdminJoined) {
                draft.adminJoinStatus = AdminConversationJoinStatus.JOINED;
              }
            }),
          isAMessageBeingProcessed: false,
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
              const isDiscoveryMessage = isDiscoveryQuestion(message);
              const latestResponseId = draft.latestResponseId;

              // If the message is a discovery message and the latest response id is not the same as the message response id, return
              if (isDiscoveryMessage && latestResponseId !== message.response_id) {
                return;
              }
              // Find existing message to update
              const existingMessageIndex = draft.messages.findIndex((msg) => shouldUpdateMessage(msg, message));

              if (existingMessageIndex !== -1) {
                draft.messages[existingMessageIndex] = {
                  ...draft.messages[existingMessageIndex],
                  ...message,
                };
              } else {
                draft.messages.push(message);
              }
            }),
          adminJoinStatus: AdminConversationJoinStatus.INIT,
          setAdminJoinStatus: (status: AdminConversationJoinStatus) => {
            set((state) => {
              state.adminJoinStatus = status;
            });
          },
          latestAdminMessageResponseId: '',
          handleAddAdminMessage: (message) => {
            set((state) => {
              if (message.response_id !== state.latestAdminMessageResponseId) {
                state.messages.push(message);
                state.latestAdminMessageResponseId = message.response_id;
              }
            });
          },
          handleAddUserMessage: (message) =>
            set((draft) => {
              // Remove previous suggestions when user sends a message
              draft.messages = filterOutSuggestions(draft.messages);
              draft.messages.push(message);

              if (draft.messages.length === 2) {
                draft.messages = [draft.messages[1]];
              }

              // Filter out messages - when the user has sent the first message ( with session_id) + welcome message + user message ( without session_id)
              if (draft.messages.length === FIRST_WELCOME_USER) {
                draft.messages = [
                  ...filterMessagesWithoutSessionId(draft.messages.slice(0), message), // Filtering out the user sent message with session_id
                  ...draft.messages.slice(1, 2), // Keeping the waiting message
                ];
              }
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
        }) as State,
    ),
  ),
);
