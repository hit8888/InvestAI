import { ChatHistory, WebSocketMessage } from '../types/webSocketData';
import { SessionApiResponse, SessionSchema } from '../types/api/session_init_response';
import { filterOutSuggestions } from '../utils/messageUtils';
import { trackError } from '../utils/error';
import { getTransformedResponse } from '../utils';

export class SessionApiResponseManager {
  private session: SessionApiResponse;

  constructor(response: SessionApiResponse) {
    const transformedResponse = getTransformedResponse(response);
    const validatedSession = SessionSchema.safeParse(transformedResponse);
    if (!validatedSession.success) {
      // console.error('Validation failed for SessionApiResponseManager:', {
      //   input: response,
      //   errors: validatedSession.error,
      // });
      trackError(validatedSession.error.errors, {
        component: 'SessionApiResponseManager',
        action: 'constructor',
      });
      throw new Error(validatedSession.error.errors.map((error) => error.message).join(', '));
    }
    this.session = validatedSession.data;
  }

  getSessionId() {
    return this.session.session_id;
  }

  getProspectId() {
    return this.session.prospect_id;
  }

  getAgentId() {
    return this.session.agent_id;
  }

  getFeedback() {
    return this.session.feedback;
  }

  public getFormattedChatHistory(welcomeMessagePayload?: WebSocketMessage): ChatHistory {
    const chatHistory = this.session.chat_history;
    const history = welcomeMessagePayload ? [welcomeMessagePayload, ...chatHistory] : chatHistory;

    // For each response_id where role is 'ai', ensure STREAM comes before TEXT or ARTIFACT
    const processedHistory = [...history];
    for (let i = 0; i < processedHistory.length; i++) {
      const currentMsg = processedHistory[i];
      if (currentMsg.role === 'ai' && (currentMsg.message_type === 'TEXT' || currentMsg.message_type === 'ARTIFACT')) {
        // Look ahead for a STREAM message with same response_id
        const streamIndex = processedHistory.findIndex(
          (msg, index) => index > i && msg.response_id === currentMsg.response_id && msg.message_type === 'STREAM',
        );

        if (streamIndex !== -1) {
          // Swap the positions
          [processedHistory[i], processedHistory[streamIndex]] = [processedHistory[streamIndex], processedHistory[i]];
        }
      }
    }

    return filterOutSuggestions(processedHistory);
  }
}
