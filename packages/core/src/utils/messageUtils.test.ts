import { WebSocketMessage, AgentEventType } from '../types/webSocketData';
import {
  filterOutSuggestions,
  isGeneratingArtifactEvent,
  isStreamMessage,
  isArtifactMessage,
  isEventMessage,
  isMessageAnalyticsEvent,
  getDemoEventData,
  isSuggestionArtifact,
} from './messageUtils';
import sessionResponseWithAllArtifacts from '../__mocks__/session_response_with_all_artifacts.json';

describe('messageUtils', () => {
  const baseMessage = {
    session_id: 'test-session',
    response_id: 'test-response',
    role: 'ai' as const,
    timestamp: new Date().toISOString(),
  };

  const messages = sessionResponseWithAllArtifacts.configuration.body.chat_history as WebSocketMessage[];

  describe('filterOutSuggestions', () => {
    it('should filter out suggestion artifacts from chat history', () => {
      const filteredMessages = filterOutSuggestions(messages);

      // Verify no messages with SUGGESTIONS artifact type remain
      expect(
        filteredMessages.some((msg) => msg.message_type === 'ARTIFACT' && msg.message.artifact_type === 'SUGGESTIONS'),
      ).toBe(false);

      // Verify other messages are preserved
      expect(filteredMessages.some((msg) => msg.message_type === 'TEXT')).toBe(true);
      expect(filteredMessages.some((msg) => msg.message_type === 'STREAM')).toBe(true);
    });
  });

  describe('isGeneratingArtifactEvent', () => {
    it('should identify GENERATING_ARTIFACT events', () => {
      const generatingArtifactMessage = messages.find(
        (msg) =>
          msg.message_type === 'EVENT' &&
          'event_type' in msg.message &&
          msg.message.event_type === 'GENERATING_ARTIFACT',
      );

      expect(isGeneratingArtifactEvent(generatingArtifactMessage!)).toBe(true);
    });

    it('should return false for non-GENERATING_ARTIFACT messages', () => {
      const textMessage = messages.find((msg) => msg.message_type === 'TEXT');
      const streamMessage = messages.find((msg) => msg.message_type === 'STREAM');

      expect(isGeneratingArtifactEvent(textMessage!)).toBe(false);
      expect(isGeneratingArtifactEvent(streamMessage!)).toBe(false);
    });
  });

  describe('isStreamMessage', () => {
    it('should identify STREAM messages', () => {
      const streamMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'STREAM',
        message: {
          content: 'test content',
          is_complete: true,
        },
      };
      const textMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'TEXT',
        message: { content: 'test content' },
      };

      expect(isStreamMessage(streamMessage)).toBe(true);
      expect(isStreamMessage(textMessage)).toBe(false);
    });
  });

  describe('isArtifactMessage', () => {
    it('should identify ARTIFACT messages', () => {
      const artifactMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'ARTIFACT',
        message: {
          artifact_type: 'SUGGESTIONS',
          content: 'Test suggestions content',
          artifact_data: {
            artifact_type: 'SUGGESTIONS',
            content: {
              title: 'Suggestions',
              items: [{ title: 'Suggestion 1', icon: null }],
            },
            artifact_id: 'test-id',
            metadata: {},
            error: null,
            error_code: null,
          },
        },
      };
      const textMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'TEXT',
        message: { content: 'test content' },
      };

      expect(isArtifactMessage(artifactMessage)).toBe(true);
      expect(isArtifactMessage(textMessage)).toBe(false);
    });
  });

  describe('isEventMessage', () => {
    it('should identify EVENT messages', () => {
      const eventMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'EVENT',
        message: {
          event_type: AgentEventType.DEMO_END,
          content: 'Demo ended',
          event_data: {},
        },
      };
      const textMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'TEXT',
        message: { content: 'test content' },
      };

      expect(isEventMessage(eventMessage)).toBe(true);
      expect(isEventMessage(textMessage)).toBe(false);
    });
  });

  describe('isMessageAnalyticsEvent', () => {
    it('should identify MESSAGE_ANALYTICS events', () => {
      const analyticsEvent: WebSocketMessage = {
        ...baseMessage,
        message_type: 'EVENT',
        message: {
          event_type: 'MESSAGE_ANALYTICS',
          content: 'Analytics event',
          event_data: { buyer_intent_score: 0.5 },
        },
      };
      const demoEndEvent: WebSocketMessage = {
        ...baseMessage,
        message_type: 'EVENT',
        message: {
          event_type: AgentEventType.DEMO_END,
          content: 'Demo ended',
          event_data: {},
        },
      };
      const textMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'TEXT',
        message: { content: 'test content' },
      };

      expect(isMessageAnalyticsEvent(analyticsEvent)).toBe(true);
      expect(isMessageAnalyticsEvent(demoEndEvent)).toBe(false);
      expect(isMessageAnalyticsEvent(textMessage)).toBe(false);
    });
  });

  describe('getDemoEventData', () => {
    it('should extract demo event data from DEMO_AVAILABLE events', () => {
      const demoEvent: WebSocketMessage = {
        ...baseMessage,
        message_type: 'EVENT',
        message: {
          event_type: AgentEventType.DEMO_AVAILABLE,
          content: 'Demo is available',
          event_data: {
            script_step: null,
            demo_available: true,
            features: [],
            response: null,
            response_audio_url: null,
          },
        },
      };
      const demoEndEvent: WebSocketMessage = {
        ...baseMessage,
        message_type: 'EVENT',
        message: {
          event_type: AgentEventType.DEMO_END,
          content: 'Demo ended',
          event_data: {},
        },
      };

      expect(getDemoEventData(demoEvent)).toEqual({
        script_step: null,
        demo_available: true,
        features: [],
        response: null,
        response_audio_url: null,
      });
      expect(getDemoEventData(demoEndEvent)).toBeNull();
      expect(getDemoEventData(undefined)).toBeNull();
    });
  });

  describe('isSuggestionArtifact', () => {
    it('should identify SUGGESTIONS artifacts', () => {
      const suggestionArtifact: WebSocketMessage = {
        ...baseMessage,
        message_type: 'ARTIFACT',
        message: {
          artifact_type: 'SUGGESTIONS',
          content: 'Test suggestions content',
          artifact_data: {
            artifact_type: 'SUGGESTIONS',
            content: {
              title: 'Suggestions',
              items: [{ title: 'Suggestion 1', icon: null }],
            },
            artifact_id: 'test-id',
            metadata: {},
            error: null,
            error_code: null,
          },
        },
      };
      const slideArtifact: WebSocketMessage = {
        ...baseMessage,
        message_type: 'ARTIFACT',
        message: {
          artifact_type: 'SLIDE',
          content: 'Test slide content',
          artifact_data: {
            artifact_type: 'SLIDE',
            content: {
              title: 'Test Slide',
              items: [{ title: 'Slide Item', icon: null }],
            },
            artifact_id: 'test-id',
            metadata: {},
            error: null,
            error_code: null,
          },
        },
      };
      const textMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'TEXT',
        message: { content: 'test content' },
      };

      expect(isSuggestionArtifact(suggestionArtifact)).toBe(true);
      expect(isSuggestionArtifact(slideArtifact)).toBe(false);
      expect(isSuggestionArtifact(textMessage)).toBe(false);
    });
  });
});
