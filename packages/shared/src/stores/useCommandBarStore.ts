import { create } from 'zustand';
import type { ConfigurationApiResponse, Nudge } from '@meaku/core/types/api/configuration_response';
import {
  ArtifactEventData,
  MessageEventType,
  SuggestionsArtifactData,
  type Message,
  type StreamResponseEventData,
} from '../types/message';
import { groupMessagesByResponseId } from '../utils/message-utils';
import type { CommandBarSettings } from '@meaku/core/types/common';
import { InitSessionResponse } from '../types/responses';

// Typing indicator timeout duration in milliseconds
const TYPING_INDICATOR_TIMEOUT = 2000;

export interface SessionData {
  sessionId: string;
  tenantId: string;
  agentId: string;
  parentUrl: string;
}

interface CommandBarState {
  // Messages
  messages: Message[];

  // Configuration
  config: ConfigurationApiResponse;

  // Settings
  settings: CommandBarSettings;

  // Session data
  sessionData: InitSessionResponse | null;

  // Suggested questions
  suggestedQuestions: string[];

  // Loading states
  isLoading: boolean;
  isConfigLoading: boolean;
  isStreaming: boolean;
  completeConfigLoaded: boolean;
  isDynamicConfigLoading: boolean;
  isDynamicConfigStarted: boolean;

  // Admin typing state
  isAdminTyping: boolean;

  // Temporary holding for artifacts during streaming
  pendingArtifacts: Message[];

  // Methods
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  setMessages: (messages: Message[]) => void;
  initMessages: (messages: Message[]) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;

  setLoading: (loading: boolean) => void;
  setAdminTyping: (isTyping: boolean) => void;
  updateSuggestedQuestions: (questions: string[]) => void;
  setConfig: (config: ConfigurationApiResponse) => void;
  setNudgeData: (nudge: Nudge | null) => void;
  setSettings: (settings: CommandBarSettings) => void;
  updateSettings: (settings: Partial<CommandBarSettings>) => void;
  setSessionData: (sessionData: InitSessionResponse) => void;
  setCompleteConfigLoaded: (completeConfigLoaded: boolean) => void;
  setDynamicConfigLoading: (isDynamicConfigLoading: boolean) => void;
  setDynamicConfigStarted: (isDynamicConfigStarted: boolean) => void;

  // Utility methods
  getLastMessage: () => Message | undefined;
  getGroupedMessages: () => Message[][];
  isMessageRenderable: (message: Message) => boolean;
  hasRenderableMessages: () => boolean;

  // Computed properties
  getRenderableMessages: () => Message[];
  isDiscoveryQuestionShown: () => boolean;
  clearSuggestedQuestionsIfDiscoveryShown: () => void;
  clearSuggestedQuestionsIfNotFromLastGroup: () => void;
}

// Utility function to determine if discovery questions should be shown
const shouldShowDiscoveryQuestions = (
  messages: Message[],
  isStreaming: boolean = false,
  isLoading: boolean = false,
): boolean => {
  // Group messages by response_id to check if discovery questions are in the last group
  const groupedMessages = groupMessagesByResponseId(messages);
  const lastGroup = groupedMessages[groupedMessages.length - 1] || [];
  const hasDiscoveryInLastGroup = lastGroup.some((msg) => msg.event_type === 'DISCOVERY_QUESTIONS');

  // Don't show discovery questions if they're not in the last group, or if streaming/loading
  if (!hasDiscoveryInLastGroup || isStreaming || isLoading) {
    return false;
  }

  // Find the discovery question in the last group
  const discoveryQuestionIndex = lastGroup.findIndex((msg) => msg.event_type === 'DISCOVERY_QUESTIONS');
  if (discoveryQuestionIndex === -1) {
    return false;
  }

  // Check if there's at least one user message in the same group
  const hasUserMessageInGroup = lastGroup.some((msg) => msg.role === 'user');
  if (!hasUserMessageInGroup) {
    return false;
  }

  // Check if there are any stream responses after the discovery question
  const messagesAfterDiscovery = lastGroup.slice(discoveryQuestionIndex + 1);
  const hasStreamResponseAfter = messagesAfterDiscovery.some((msg) => msg.event_type === 'STREAM_RESPONSE');

  // Don't show discovery question if there are stream responses after it
  return !hasStreamResponseAfter;
};

export const useCommandBarStore = create<CommandBarState>()((set, get) => {
  // Store timeout reference for typing indicator
  let typingTimeoutId: NodeJS.Timeout | null = null;

  const clearTypingTimeout = () => {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
  };

  const setTypingWithTimeout = (isTyping: boolean) => {
    clearTypingTimeout();

    if (isTyping) {
      set({ isAdminTyping: true });
      // Set timeout to automatically hide typing indicator
      typingTimeoutId = setTimeout(() => {
        set({ isAdminTyping: false });
        typingTimeoutId = null;
      }, TYPING_INDICATOR_TIMEOUT);
    } else {
      set({ isAdminTyping: false });
    }
  };

  return {
    // Initial state
    messages: [],
    config: {} as ConfigurationApiResponse,
    settings: {} as CommandBarSettings,
    sessionData: null,
    suggestedQuestions: [],
    isLoading: false,
    isConfigLoading: false,
    isStreaming: false,
    isAdminTyping: false,
    pendingArtifacts: [],
    completeConfigLoaded: false,
    isDynamicConfigLoading: false,
    isDynamicConfigStarted: false,

    // Message methods
    addMessage: (message) => {
      const newMessage = {
        ...message,
        timestamp: new Date().toISOString(),
      } as Message;

      set((state) => {
        let updatedMessages = [...state.messages];
        let updatedPendingArtifacts = [...state.pendingArtifacts];

        // Check if this is an artifact message (excluding SUGGESTIONS_ARTIFACT which is handled separately)
        const isArtifact = [
          'FORM_ARTIFACT',
          'QUALIFICATION_FORM_ARTIFACT',
          'CALENDAR_ARTIFACT',
          'DEMO_ARTIFACT',
          'VIDEO_ARTIFACT',
          'SLIDE_ARTIFACT',
          'SLIDE_IMAGE_ARTIFACT',
          'GENERATING_ARTIFACT',
          'DISCOVERY_QUESTIONS',
          'CTA_EVENT',
        ].includes(newMessage.event_type);

        // Handle STREAM_RESPONSE events - replace existing stream messages
        if (newMessage.event_type === MessageEventType.STREAM_RESPONSE) {
          const streamData = newMessage.event_data as StreamResponseEventData;
          const isComplete = streamData?.is_complete === true;
          const isStreaming = streamData?.is_complete === false;
          const newStreamContent = streamData?.content || '';

          if (newMessage.event_data.content === '') {
            return state;
          }

          const existingStreamIndex = updatedMessages.findIndex((msg) => {
            if (msg.response_id === newMessage.response_id && msg.event_type === MessageEventType.STREAM_RESPONSE) {
              const existingStreamData = msg.event_data as StreamResponseEventData;
              const existingContent = existingStreamData?.content || '';

              // Check if new message contains the old message content (incremental update)
              // For empty content, we still want to match and replace
              return newStreamContent.includes(existingContent);
            }
            return false;
          });

          if (existingStreamIndex !== -1) {
            // Check if the existing stream response is already complete
            const existingStream = updatedMessages[existingStreamIndex];
            const existingStreamData = existingStream.event_data as StreamResponseEventData;
            const isExistingStreamComplete = existingStreamData?.is_complete === true;

            if (isExistingStreamComplete) {
              // If the existing stream is complete, add as new message
              updatedMessages.push(newMessage);
            } else {
              // Replace existing stream message if it's not complete
              updatedMessages[existingStreamIndex] = {
                ...newMessage,
                timestamp: updatedMessages[existingStreamIndex].timestamp, // Preserve original timestamp
              } as Message;
            }
          } else {
            // Add new stream message
            updatedMessages.push(newMessage);
          }

          // If stream is complete, add any pending artifacts to messages
          if (isComplete && updatedPendingArtifacts.length > 0) {
            updatedMessages = [...updatedMessages, ...updatedPendingArtifacts];
            updatedPendingArtifacts = []; // Clear pending artifacts
          }

          // Apply grouping and ordering logic
          const groupedMessages = groupMessagesByResponseId(updatedMessages);
          const orderedMessages = groupedMessages.flat();

          return {
            messages: orderedMessages,
            pendingArtifacts: updatedPendingArtifacts,
            isStreaming,
            ...(isComplete && { isStreaming: false }),
            isLoading: false, // Turn off loading as soon as any stream response is received
          };
        }

        // Handle artifacts - hold them if streaming, otherwise add to messages
        if (isArtifact) {
          // Check if there's an incomplete stream for this response_id
          const hasIncompleteStream = updatedMessages.some(
            (msg) =>
              msg.response_id === newMessage.response_id &&
              msg.event_type === MessageEventType.STREAM_RESPONSE &&
              (msg.event_data as StreamResponseEventData)?.is_complete === false,
          );

          if (state.isStreaming || hasIncompleteStream) {
            // Hold artifact during streaming or if there's an incomplete stream
            updatedPendingArtifacts.push(newMessage);

            return {
              pendingArtifacts: updatedPendingArtifacts,
              isLoading: false, // Turn off loading as soon as any artifact event arrives
            };
          } else {
            // Add artifact to messages if not streaming and no incomplete stream
            updatedMessages.push(newMessage);

            // Apply grouping and ordering logic
            const groupedMessages = groupMessagesByResponseId(updatedMessages);
            const orderedMessages = groupedMessages.flat();

            return {
              messages: orderedMessages,
              pendingArtifacts: updatedPendingArtifacts,
              isLoading: false, // Turn off loading as soon as any artifact event arrives
            };
          }
        }

        // Handle SUGGESTIONS_ARTIFACT events specifically for suggested questions
        if (newMessage.event_type === 'SUGGESTIONS_ARTIFACT') {
          const eventData = newMessage.event_data as ArtifactEventData;
          const artifactData = eventData.artifact_data as SuggestionsArtifactData;
          const suggestedQuestions = artifactData?.content?.suggested_questions;

          if (suggestedQuestions && Array.isArray(suggestedQuestions)) {
            // Add to messages if not streaming, otherwise hold in pending artifacts
            if (state.isStreaming) {
              updatedPendingArtifacts.push(newMessage);
              return {
                pendingArtifacts: updatedPendingArtifacts,
                isLoading: false, // Turn off loading as soon as any artifact event arrives
              };
            } else {
              updatedMessages.push(newMessage);

              // Apply grouping and ordering logic
              const groupedMessages = groupMessagesByResponseId(updatedMessages);
              const orderedMessages = groupedMessages.flat();

              // Check if this SUGGESTIONS_ARTIFACT is from the last group
              const lastGroup = groupedMessages[groupedMessages.length - 1] || [];
              const isFromLastGroup = lastGroup.some((msg) => msg.response_id === newMessage.response_id);
              const isLastGroupContainsCalendarArtifact = lastGroup.some(
                (msg) => msg.event_type === 'CALENDAR_ARTIFACT',
              );

              return {
                messages: orderedMessages,
                pendingArtifacts: updatedPendingArtifacts,
                // Only set suggested questions if it's from the last group and not currently loading
                ...(!isLastGroupContainsCalendarArtifact && isFromLastGroup && !state.isLoading
                  ? { suggestedQuestions }
                  : {}),
                isLoading: false, // Turn off loading as soon as any artifact event arrives
              };
            }
          }
        }

        // Handle user messages
        if (newMessage.role === 'user') {
          updatedMessages.push(newMessage);

          // Apply grouping and ordering logic
          const groupedMessages = groupMessagesByResponseId(updatedMessages);
          const orderedMessages = groupedMessages.flat();

          // Clear suggested questions when user sends a message (they'll be set again if the response has them)
          // Don't set loading for FORM_FILLED events as they are responses to existing artifacts
          // Always set loading for BOOK_MEETING events to show wave loader
          const shouldSetLoading =
            newMessage.event_type === 'BOOK_MEETING' ||
            (newMessage.event_type !== 'FORM_FILLED' &&
              newMessage.event_type !== 'QUALIFICATION_FORM_FILLED' &&
              newMessage.event_type !== 'CALENDAR_SUBMIT' &&
              newMessage.event_type !== 'PRIMARY_GOAL_CTA_CLICKED' &&
              newMessage.event_type !== 'USER_TYPING');

          return {
            messages: orderedMessages,
            pendingArtifacts: updatedPendingArtifacts,
            suggestedQuestions: [], // Clear suggestions when user sends a message
            isLoading: shouldSetLoading, // Set loading for BOOK_MEETING and non-form-filled user messages
          };
        }

        // Handle TEXT_RESPONSE events
        if (newMessage.event_type === 'TEXT_RESPONSE') {
          updatedMessages.push(newMessage);

          // Apply grouping and ordering logic
          const groupedMessages = groupMessagesByResponseId(updatedMessages);
          const orderedMessages = groupedMessages.flat();

          return {
            messages: orderedMessages,
            pendingArtifacts: updatedPendingArtifacts,
            isLoading: false, // Turn off loading as soon as any text response arrives
          };
        }

        // Handle ADMIN_TYPING events - update global typing state with timeout
        if (
          newMessage.event_type === 'ADMIN_TYPING' ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((newMessage as any).message_type === 'EVENT' && (newMessage as any).message?.event_type === 'ADMIN_TYPING')
        ) {
          // Use the timeout mechanism to handle typing state
          setTypingWithTimeout(true);
          // Don't add ADMIN_TYPING messages to the messages array, just update the global state
          return {
            pendingArtifacts: updatedPendingArtifacts,
          };
        }

        // Handle all other messages
        updatedMessages.push(newMessage);

        // Apply grouping and ordering logic
        const groupedMessages = groupMessagesByResponseId(updatedMessages);
        const orderedMessages = groupedMessages.flat();

        return {
          messages: orderedMessages,
          pendingArtifacts: updatedPendingArtifacts,
          isLoading: false, // Keep loading false for other messages
        };
      });
    },

    updateMessage: (id, updates) => {
      set((state) => ({
        messages: state.messages.map((msg) => (msg.response_id === id ? ({ ...msg, ...updates } as Message) : msg)),
      }));
    },

    removeMessage: (id) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.response_id !== id),
      }));
    },

    clearMessages: () => {
      clearTypingTimeout();
      set({ messages: [], pendingArtifacts: [], isStreaming: false, isLoading: false, isAdminTyping: false });
    },

    // Loading state
    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setAdminTyping: (isTyping) => {
      setTypingWithTimeout(isTyping);
    },

    updateSuggestedQuestions: (questions) => {
      set({ suggestedQuestions: questions });
    },

    clearSuggestedQuestions: () => {
      set({ suggestedQuestions: [] });
    },

    setConfig: (config) => {
      set({ config });

      // Only set default suggested questions if there's no chat history at all
      const state = get();
      if (config?.body?.welcome_message?.suggested_questions && state.messages.length === 0) {
        set({ suggestedQuestions: config.body.welcome_message.suggested_questions });
      }
    },

    setNudgeData: (nudge) => {
      const state = get();
      if (state.config.command_bar) {
        set({
          config: {
            ...state.config,
            command_bar: {
              ...state.config.command_bar,
              nudge_data: nudge,
            },
          },
        });
      }
    },

    setCompleteConfigLoaded: (completeConfigLoaded) => {
      set({ completeConfigLoaded });
    },

    setDynamicConfigLoading: (isDynamicConfigLoading) => {
      set({ isDynamicConfigLoading });
    },

    setDynamicConfigStarted: (isDynamicConfigStarted) => {
      set({ isDynamicConfigStarted });
    },

    setMessages: (messages) => {
      // Apply grouping and ordering logic to the messages
      const groupedMessages = groupMessagesByResponseId(messages);
      const orderedMessages = groupedMessages.flat();

      // Use the utility function to determine if discovery questions should be shown
      const shouldShowDiscovery = shouldShowDiscoveryQuestions(orderedMessages);

      // Filter messages to only show discovery questions from the last group when conditions are met
      const filteredMessages = orderedMessages.filter((message) => {
        if (message.event_type === 'DISCOVERY_QUESTIONS') {
          // Check if this discovery question is in the last group
          const messageGroupIndex = groupedMessages.findIndex((group) =>
            group.some((msg) => msg.response_id === message.response_id),
          );
          const isInLastGroup = messageGroupIndex === groupedMessages.length - 1;

          return isInLastGroup && shouldShowDiscovery;
        }

        // Show all other messages
        return true;
      });

      // Find SUGGESTIONS_ARTIFACT message from the last group only
      const lastGroupForSuggestions = groupedMessages[groupedMessages.length - 1] || [];
      const lastGroupSuggestionsMessage = lastGroupForSuggestions.find(
        (msg) => msg.event_type === 'SUGGESTIONS_ARTIFACT',
      );

      let latestSuggestedQuestions: string[] = [];
      if (lastGroupSuggestionsMessage) {
        const eventData = lastGroupSuggestionsMessage.event_data as ArtifactEventData;
        const artifactData = eventData.artifact_data as SuggestionsArtifactData;
        latestSuggestedQuestions = artifactData?.content?.suggested_questions || [];
      }

      set({
        messages: filteredMessages,
        // Show suggested questions from SUGGESTIONS_ARTIFACT if available, otherwise keep existing suggestions
        ...(latestSuggestedQuestions.length > 0 && { suggestedQuestions: latestSuggestedQuestions }),
      });

      // Clear suggested questions if they're not from the last group
      get().clearSuggestedQuestionsIfNotFromLastGroup();
    },

    initMessages: (messages) => {
      const state = get();

      // Apply grouping and ordering logic to the messages
      const groupedMessages = groupMessagesByResponseId(messages);
      const orderedMessages = groupedMessages.flat();

      // Use the utility function to determine if discovery questions should be shown
      const shouldShowDiscovery = shouldShowDiscoveryQuestions(orderedMessages);

      // Filter messages to only show discovery questions from the last group when conditions are met
      const filteredMessages = orderedMessages.filter((message) => {
        if (message.event_type === 'DISCOVERY_QUESTIONS') {
          // Check if this discovery question is in the last group
          const messageGroupIndex = groupedMessages.findIndex((group) =>
            group.some((msg) => msg.response_id === message.response_id),
          );
          const isInLastGroup = messageGroupIndex === groupedMessages.length - 1;

          return isInLastGroup && shouldShowDiscovery;
        }

        // Show all other messages
        return true;
      });

      if (state.messages.length === 0) {
        // Find SUGGESTIONS_ARTIFACT message from the last group only
        const lastGroup = groupedMessages[groupedMessages.length - 1] || [];
        const lastGroupSuggestionsMessage = lastGroup.find((msg) => msg.event_type === 'SUGGESTIONS_ARTIFACT');
        const isLastGroupContainsCalendarArtifact = lastGroup.some((msg) => msg.event_type === 'CALENDAR_ARTIFACT');

        let latestSuggestedQuestions: string[] = [];
        if (lastGroupSuggestionsMessage && !isLastGroupContainsCalendarArtifact) {
          const eventData = lastGroupSuggestionsMessage.event_data as ArtifactEventData;
          const artifactData = eventData.artifact_data as SuggestionsArtifactData;
          latestSuggestedQuestions = artifactData?.content?.suggested_questions || [];
        }

        set({
          messages: filteredMessages,
          // Show suggested questions from SUGGESTIONS_ARTIFACT if available, otherwise keep default from config
          ...(latestSuggestedQuestions.length > 0 && { suggestedQuestions: latestSuggestedQuestions }),
        });

        // Clear suggested questions if they're not from the last group
        get().clearSuggestedQuestionsIfNotFromLastGroup();
      } else {
        // Combine existing and new messages, then apply grouping and ordering
        const allMessages = [...filteredMessages, ...state.messages];
        const allGroupedMessages = groupMessagesByResponseId(allMessages);
        const allOrderedMessages = allGroupedMessages.flat();

        // Use the utility function to determine if discovery questions should be shown for combined messages
        const allShouldShowDiscovery = shouldShowDiscoveryQuestions(allOrderedMessages);

        const allFilteredMessages = allOrderedMessages.filter((message) => {
          if (message.event_type === 'DISCOVERY_QUESTIONS') {
            const allMessageGroupIndex = allGroupedMessages.findIndex((group) =>
              group.some((msg) => msg.response_id === message.response_id),
            );
            const allIsInLastGroup = allMessageGroupIndex === allGroupedMessages.length - 1;

            return allIsInLastGroup && allShouldShowDiscovery;
          }

          return true;
        });

        // Find SUGGESTIONS_ARTIFACT message from the last group only
        const allLastGroupForSuggestions = allGroupedMessages[allGroupedMessages.length - 1] || [];
        const allLastGroupSuggestionsMessage = allLastGroupForSuggestions.find(
          (msg) => msg.event_type === 'SUGGESTIONS_ARTIFACT',
        );

        let latestSuggestedQuestions: string[] = [];
        if (allLastGroupSuggestionsMessage) {
          const eventData = allLastGroupSuggestionsMessage.event_data as ArtifactEventData;
          const artifactData = eventData.artifact_data as SuggestionsArtifactData;
          latestSuggestedQuestions = artifactData?.content?.suggested_questions || [];
        }

        set({
          messages: allFilteredMessages,
          // Only update suggested questions if we found a SUGGESTIONS_ARTIFACT event
          ...(latestSuggestedQuestions.length > 0 && { suggestedQuestions: latestSuggestedQuestions }),
        });

        // Clear suggested questions if they're not from the last group
        get().clearSuggestedQuestionsIfNotFromLastGroup();
      }
    },

    setSettings: (settings) => {
      set({ settings });
    },

    updateSettings: (settings) => {
      set((state) => ({
        settings: {
          ...state.settings,
          ...settings,
        },
      }));
    },

    setSessionData: (sessionData) => {
      set({ sessionData });
    },

    // Utility methods
    getLastMessage: () => {
      const state = get();
      return state.messages[state.messages.length - 1];
    },

    getGroupedMessages: () => {
      const messages = get().messages;
      const grouped = groupMessagesByResponseId(messages);
      return grouped;
    },

    // Check if a message is renderable
    isMessageRenderable: (message: Message) => {
      const renderableTypes = [
        'TEXT_REQUEST',
        'TEXT_RESPONSE',
        'STREAM_RESPONSE',
        'SUGGESTED_QUESTION_CLICKED',
        'BOOK_MEETING',
        'VIDEO_ARTIFACT',
        'SLIDE_IMAGE_ARTIFACT',
        'FORM_ARTIFACT',
        'QUALIFICATION_FORM_ARTIFACT',
        'CALENDAR_ARTIFACT',
        'DEMO_ARTIFACT',
        'DISCOVERY_QUESTIONS',
        'FORM_FILLED',
        'QUALIFICATION_FORM_FILLED',
        'CALENDAR_SUBMIT',
        'CTA_EVENT',
        'PRIMARY_GOAL_CTA_CLICKED',
        'NUDGE_CTA_CLICKED',
      ];

      const ADMIN_SESSION_EVENTS = ['JOIN_SESSION', 'LEAVE_SESSION', 'ADMIN_RESPONSE', 'ADMIN_TYPING'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (ADMIN_SESSION_EVENTS.includes((message as any).message?.event_type)) {
        return true;
      }

      return renderableTypes.includes(message.event_type);
    },

    // Check if we have any renderable messages
    hasRenderableMessages: () => {
      const state = get();
      return state.messages.some(state.isMessageRenderable);
    },

    // Get messages that should be rendered (filter out artifacts during streaming)
    getRenderableMessages: () => {
      const state = get();

      // Clear suggested questions if they're not from the last group
      state.clearSuggestedQuestionsIfNotFromLastGroup();

      // Use the utility function to determine if discovery questions should be shown
      const shouldShowDiscovery = shouldShowDiscoveryQuestions(state.messages, state.isStreaming, state.isLoading);

      if (!state.isStreaming) {
        // If not streaming, filter messages based on discovery question conditions
        const groupedMessages = groupMessagesByResponseId(state.messages);
        const filteredMessages = state.messages.filter((message) => {
          // If it's a discovery question, only show it if it's in the last group and conditions are met
          if (message.event_type === 'DISCOVERY_QUESTIONS') {
            // Check if this discovery question is in the last group
            const messageGroupIndex = groupedMessages.findIndex((group) =>
              group.some((msg) => msg.response_id === message.response_id),
            );
            const isInLastGroup = messageGroupIndex === groupedMessages.length - 1;

            return isInLastGroup && shouldShowDiscovery;
          }

          // Show all other messages that are renderable
          return state.isMessageRenderable(message);
        });

        // Re-apply grouping and ordering to preserve the correct order
        const reGroupedMessages = groupMessagesByResponseId(filteredMessages);
        return reGroupedMessages.flat();
      }

      // If streaming, filter out artifacts but keep other messages
      const filteredMessages = state.messages.filter((message) => {
        const artifactTypes = [
          'FORM_ARTIFACT',
          'CALENDAR_ARTIFACT',
          'VIDEO_ARTIFACT',
          'SLIDE_ARTIFACT',
          'SLIDE_IMAGE_ARTIFACT',
          'DEMO_ARTIFACT',
          'GENERATING_ARTIFACT',
          'DISCOVERY_QUESTIONS',
          'QUALIFICATION_FORM_ARTIFACT',
          'SUGGESTIONS_ARTIFACT',
        ];

        // Keep all renderable messages that are not artifacts
        if (!artifactTypes.includes(message.event_type)) {
          return state.isMessageRenderable(message);
        }

        // Filter out artifacts during streaming
        return false;
      });

      // Re-apply grouping and ordering to preserve the correct order
      const reGroupedMessages = groupMessagesByResponseId(filteredMessages);
      return reGroupedMessages.flat();
    },

    // Check if discovery questions are currently being shown
    isDiscoveryQuestionShown: () => {
      const state = get();
      return shouldShowDiscoveryQuestions(state.messages, state.isStreaming, state.isLoading);
    },

    // Clear suggested questions when discovery questions are shown
    clearSuggestedQuestionsIfDiscoveryShown: () => {
      const state = get();

      if (state.isDiscoveryQuestionShown()) {
        set({ suggestedQuestions: [] });
      }
    },

    // Clear suggested questions if they're not from the last group
    clearSuggestedQuestionsIfNotFromLastGroup: () => {
      const state = get();

      // If there are no messages, keep default suggested questions from config
      if (state.messages.length === 0) {
        return;
      }

      // Filter out summarize events that shouldn't affect suggested questions logic
      const filteredMessages = state.messages.filter(
        (msg) => msg.event_type !== 'SUMMARIZE' && msg.event_type !== 'SUMMARY_STREAM',
      );

      // Group messages by response_id to check if suggested questions are in the last group
      const groupedMessages = groupMessagesByResponseId(filteredMessages);
      const lastGroup = groupedMessages[groupedMessages.length - 1] || [];
      const hasSuggestionsInLastGroup = lastGroup.some((msg) => msg.event_type === 'SUGGESTIONS_ARTIFACT');

      // If there are no suggested questions in the last group, clear them
      if (!hasSuggestionsInLastGroup && state.suggestedQuestions.length > 0) {
        set({ suggestedQuestions: [] });
      }
    },
  };
});
