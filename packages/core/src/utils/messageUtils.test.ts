import { AgentEventType, ArtifactMessageContent, WebSocketMessage } from '../types/webSocketData';
import {
  checkIsArtifactMessage,
  isDiscoveryQuestion,
  checkIsEventMessage,
  checkIsMainResponseMessage,
  checkIsSalesResponseComplete,
  filterOutSuggestions,
  getAnalyticsEvent,
  getDemoQuestionData,
  getFormArtifactMessage,
  getFormFilledEvent,
  getSuggestionsArtifactMessage,
  isGeneratingMediaArtifactEvent,
  isMessageAnalyticsEvent,
  isStreamMessage,
  isStreamMessageComplete,
  isSuggestionArtifact,
} from './messageUtils';
import sessionResponseWithAllArtifacts from '../__mocks__/session_response_with_all_artifacts.json';
import { describe, expect, it } from 'vitest';
import { FormArtifactContent } from '../types';

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

  describe('isGeneratingMediaArtifactEvent', () => {
    it('should identify GENERATING_ARTIFACT events', () => {
      const generatingArtifactMessage = messages.find(
        (msg) =>
          msg.message_type === 'EVENT' &&
          'event_type' in msg.message &&
          msg.message.event_type === 'GENERATING_ARTIFACT',
      );

      expect(isGeneratingMediaArtifactEvent(generatingArtifactMessage!)).toBe(true);
    });

    it('should return false for non-GENERATING_ARTIFACT messages', () => {
      const textMessage = messages.find((msg) => msg.message_type === 'TEXT');
      const streamMessage = messages.find((msg) => msg.message_type === 'STREAM');

      expect(isGeneratingMediaArtifactEvent(textMessage!)).toBe(false);
      expect(isGeneratingMediaArtifactEvent(streamMessage!)).toBe(false);
    });
  });

  describe('isStreamMessage', () => {
    it('should identify STREAM messages', () => {
      const streamMessage: WebSocketMessage = {
        ...baseMessage,
        actor: 'SALES',
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

  describe('checkIsArtifactMessage', () => {
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

      expect(checkIsArtifactMessage(artifactMessage)).toBe(true);
      expect(checkIsArtifactMessage(textMessage)).toBe(false);
    });
  });

  describe('checkIsEventMessage', () => {
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

      expect(checkIsEventMessage(eventMessage)).toBe(true);
      expect(checkIsEventMessage(textMessage)).toBe(false);
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

  describe('getDemoQuestionData', () => {
    it('should return DemoEventData when message contains valid demo question data', () => {
      const message: WebSocketMessage = {
        session_id: '123',
        response_id: '456',
        role: 'ai',
        timestamp: '2024-01-01',
        message_type: 'EVENT',
        message: {
          content: '',
          event_type: 'DEMO_QUESTION',
          event_data: {
            demo_available: true,
            features: [],
            script_step: null,
            response: null,
            response_audio_url: null,
          },
        },
      };

      const result = getDemoQuestionData(message);
      expect(result).toEqual(message.message.event_data);
    });

    it('should return null for empty event_data object', () => {
      const message: WebSocketMessage = {
        session_id: '123',
        response_id: '456',
        role: 'ai',
        timestamp: '2024-01-01',
        message_type: 'EVENT',
        message: {
          content: '',
          event_type: 'DEMO_QUESTION',
          event_data: {},
        },
      };

      const result = getDemoQuestionData(message);
      expect(result).toBeNull();
    });

    it('should return null for non-demo question messages', () => {
      const message: WebSocketMessage = {
        session_id: '123',
        response_id: '456',
        role: 'ai',
        timestamp: '2024-01-01',
        message_type: 'TEXT',
        message: {
          content: 'Hello',
        },
      };

      const result = getDemoQuestionData(message);
      expect(result).toBeNull();
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

  describe('isStreamMessageComplete', () => {
    it('should identify complete messages', () => {
      const completeMessage: WebSocketMessage = {
        ...baseMessage,
        actor: 'SALES',
        message_type: 'STREAM',
        message: { content: 'test content', is_complete: true },
      };
      expect(isStreamMessageComplete(completeMessage)).toBe(true);
    });

    it('should identify incomplete messages', () => {
      const incompleteMessage: WebSocketMessage = {
        ...baseMessage,
        message_type: 'STREAM',
        message: { content: 'test content' },
      };
      expect(isStreamMessageComplete(incompleteMessage)).toBe(false);
    });
  });

  describe('getSuggestionsArtifactMessage', () => {
    it('should return the first artifact message that is not a suggestions artifact', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'ARTIFACT',
          message: {
            artifact_type: 'FORM',
            content: 'Form content',
            artifact_data: {
              artifact_type: 'FORM',
              artifact_id: '123',
              content: {
                title: 'Form Title',
                fields: [],
              },
              metadata: {},
              error: null,
              error_code: null,
            },
          },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'ARTIFACT',
          message: {
            artifact_type: 'SUGGESTIONS',
            content: 'Suggestions content',
            artifact_data: {
              artifact_type: 'SUGGESTIONS',
              artifact_id: '456',
              content: {
                title: 'Suggestions',
                items: [],
              },
              metadata: {},
              error: null,
              error_code: null,
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getSuggestionsArtifactMessage(messages);
      expect(result).toEqual(messages[1]);
    });

    it('should return undefined if no non-suggestion artifact message is found', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'ARTIFACT',
          message: {
            artifact_type: 'SUGGESTIONS',
            content: 'Suggestions content',
            artifact_data: {
              artifact_type: 'SUGGESTIONS',
              artifact_id: '456',
              content: {
                title: 'Suggestions',
                items: [],
              },
              metadata: {},
              error: null,
              error_code: null,
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getSuggestionsArtifactMessage(messages);
      expect(result).toBeUndefined();
    });
  });

  describe('getFormArtifactMessage', () => {
    it('should return the first form artifact message', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'ARTIFACT',
          message: {
            artifact_type: 'FORM',
            content: 'Form content',
            artifact_data: {
              artifact_type: 'FORM',
              artifact_id: '123',
              content: {
                title: 'Form Title',
                fields: [],
              },
              metadata: {},
              error: null,
              error_code: null,
            },
          },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'ARTIFACT',
          message: {
            artifact_type: 'SUGGESTIONS',
            content: 'Suggestions content',
            artifact_data: {
              artifact_type: 'SUGGESTIONS',
              artifact_id: '456',
              content: {
                title: 'Suggestions',
                items: [],
              },
              metadata: {},
              error: null,
              error_code: null,
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getFormArtifactMessage(messages);
      expect(result).toEqual(messages[1]);
    });

    it('should return undefined if no form artifact message is found', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'ARTIFACT',
          message: {
            artifact_type: 'SUGGESTIONS',
            content: 'Suggestions content',
            artifact_data: {
              artifact_type: 'SUGGESTIONS',
              artifact_id: '456',
              content: {
                title: 'Suggestions',
                items: [],
              },
              metadata: {},
              error: null,
              error_code: null,
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getFormArtifactMessage(messages);
      expect(result).toBeUndefined();
    });
  });

  describe('getFormFilledEvent', () => {
    it('should return the form filled event that matches the form artifact id', () => {
      const formArtifact: WebSocketMessage & {
        message: ArtifactMessageContent & { artifact_data: FormArtifactContent };
      } = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai',
        timestamp: new Date().toISOString(),
        message_type: 'ARTIFACT',
        message: {
          artifact_type: 'FORM',
          content: 'Form content',
          artifact_data: {
            artifact_type: 'FORM',
            artifact_id: '123',
            form_fields: [],
            content: {
              form_fields: [],
            },
            metadata: {},
            error: null,
            error_code: null,
          },
        },
      };

      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'FORM_FILLED',
            content: 'Form filled',
            event_data: {
              artifact_id: '123',
              form_data: {},
            },
          },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'FORM_FILLED',
            content: 'Form filled',
            event_data: {
              artifact_id: '456',
              form_data: {},
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getFormFilledEvent(messages, formArtifact, 'FORM_FILLED');
      expect(result).toEqual(messages[1]);
    });

    it('should return undefined if no matching form filled event is found', () => {
      const formArtifact: WebSocketMessage & {
        message: ArtifactMessageContent & { artifact_data: FormArtifactContent };
      } = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai' as const,
        timestamp: new Date().toISOString(),
        message_type: 'ARTIFACT',
        message: {
          content: 'Form content',
          artifact_type: 'FORM',
          artifact_data: {
            artifact_id: '123',
            artifact_type: 'FORM',
            form_fields: [],
            content: {
              form_fields: [],
            },
            metadata: {},
            error: null,
            error_code: null,
          },
        },
      };

      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'FORM_FILLED',
            content: 'Form filled',
            event_data: {
              artifact_id: '456',
              form_data: {},
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getFormFilledEvent(messages, formArtifact, 'FORM_FILLED');
      expect(result).toBeUndefined();
    });

    it('should return undefined if formArtifactMessage is undefined', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'FORM_FILLED',
            content: 'Form filled',
            event_data: {
              artifact_id: '123',
              form_data: {},
            },
          },
        },
      ] as WebSocketMessage[];

      const result = getFormFilledEvent(messages, undefined, 'FORM_FILLED');
      expect(result).toBeUndefined();
    });
  });

  describe('getAnalyticsEvent', () => {
    it('should return the first message analytics event', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'MESSAGE_ANALYTICS',
            content: 'Analytics data',
            event_data: {
              buyer_intent_score: 0.75,
            },
          },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'DEMO_END',
            content: 'Demo ended',
            event_data: {},
          },
        },
      ] as WebSocketMessage[];

      const result = getAnalyticsEvent(messages);
      expect(result).toEqual(messages[1]);
    });

    it('should return undefined if no message analytics event is found', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          message: { content: 'Hello' },
        },
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'EVENT',
          message: {
            event_type: 'DEMO_END',
            content: 'Demo ended',
            event_data: {},
          },
        },
      ] as WebSocketMessage[];

      const result = getAnalyticsEvent(messages);
      expect(result).toBeUndefined();
    });
  });

  describe('checkIsMainResponseMessage', () => {
    it('should return true for a sales stream message', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai' as const,
        timestamp: new Date().toISOString(),
        message_type: 'STREAM',
        actor: 'SALES',
        message: {
          content: 'Hello',
          is_complete: false,
        },
      } as WebSocketMessage;

      const result = checkIsMainResponseMessage(message);
      expect(result).toBe(true);
    });

    it('should return true for a sales text message', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai' as const,
        timestamp: new Date().toISOString(),
        message_type: 'TEXT',
        actor: 'SALES',
        message: {
          content: 'Hello',
        },
      } as WebSocketMessage;

      const result = checkIsMainResponseMessage(message);
      expect(result).toBe(true);
    });

    it('should return false for a non-sales message', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'user' as const,
        timestamp: new Date().toISOString(),
        message_type: 'TEXT',
        message: {
          content: 'Hello',
        },
      } as WebSocketMessage;

      const result = checkIsMainResponseMessage(message);
      expect(result).toBe(false);
    });

    it('should return false for a sales message with unsupported type', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai' as const,
        message_type: 'EVENT',
        actor: 'SALES',
        message: {
          content: 'Form content',
        },
      } as WebSocketMessage;

      const result = checkIsMainResponseMessage(message);
      expect(result).toBe(false);
    });
  });

  describe('checkIsSalesResponseComplete', () => {
    it('should return true if there is a complete sales stream message', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'STREAM',
          actor: 'SALES',
          message: {
            content: 'Hello',
            is_complete: true,
          },
        },
      ] as WebSocketMessage[];

      const result = checkIsSalesResponseComplete(messages);
      expect(result).toBe(true);
    });

    it('should return true if there is a sales text message', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'TEXT',
          actor: 'SALES',
          message: {
            content: 'Hello',
          },
        },
      ] as WebSocketMessage[];

      const result = checkIsSalesResponseComplete(messages);
      expect(result).toBe(true);
    });

    it('should return false if there are no complete sales messages', () => {
      const messages = [
        {
          session_id: 'test-session',
          response_id: 'test-response',
          role: 'ai' as const,
          timestamp: new Date().toISOString(),
          message_type: 'STREAM',
          actor: 'SALES',
          message: {
            content: 'Hello',
            is_complete: false,
          },
        },
      ] as WebSocketMessage[];

      const result = checkIsSalesResponseComplete(messages);
      expect(result).toBe(false);
    });

    it('should return false for empty messages array', () => {
      const result = checkIsSalesResponseComplete([]);
      expect(result).toBe(false);
    });
  });

  describe('isDiscoveryQuestion', () => {
    it('should return true for a discovery questions text message', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai' as const,
        timestamp: new Date().toISOString(),
        message_type: 'EVENT',
        actor: 'DISCOVERY_QUESTIONS',
        message: {
          content: 'Hello',
          event_type: 'DISCOVERY_QUESTIONS',
        },
      } as WebSocketMessage;

      const result = isDiscoveryQuestion(message);
      expect(result).toBe(true);
    });

    it('should return false for a non-discovery questions message', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'user' as const,
        timestamp: new Date().toISOString(),
        message_type: 'TEXT',
        message: {
          content: 'Hello',
        },
      } as WebSocketMessage;

      const result = isDiscoveryQuestion(message);
      expect(result).toBe(false);
    });

    it('should return false for a discovery questions non-text message', () => {
      const message = {
        session_id: 'test-session',
        response_id: 'test-response',
        role: 'ai' as const,
        timestamp: new Date().toISOString(),
        message_type: 'STREAM',
        actor: 'DISCOVERY_QUESTIONS',
        message: {
          content: 'Hello',
          is_complete: false,
        },
      } as WebSocketMessage;

      const result = isDiscoveryQuestion(message);
      expect(result).toBe(false);
    });
  });
});
