import { ChatHistory, WebSocketMessage } from '../types/webSocketData';
import { SessionApiResponse } from '../types/api/session_init_response';

const WELCOME_MESSAGE_STATE = 1;
const USER_WELCOME_MESSAGE_STATE = 2;

export class SessionApiResponseManager {
  private session: SessionApiResponse;

  constructor(response: SessionApiResponse) {
    this.session = response;
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

  public getFormattedChatHistory(messagesPayload?: WebSocketMessage[]): ChatHistory {
    const chatHistory = this.session.chat_history;

    // If no messages payload, return existing chat history
    if (!messagesPayload) {
      return chatHistory;
    }

    // Handle different message payload scenarios
    let history: WebSocketMessage[];
    if (messagesPayload.length >= USER_WELCOME_MESSAGE_STATE) {
      // For 2 or more messages, append to existing history if it exists ( overlay agent )
      history =
        chatHistory.length > 0
          ? [...messagesPayload.slice(0, 1), ...chatHistory, ...messagesPayload.slice(1)]
          : [...messagesPayload];
    } else if (messagesPayload.length === WELCOME_MESSAGE_STATE) {
      // For single welcome message, prepend to existing history - when init api is called
      history = [...messagesPayload, ...chatHistory];
    } else {
      history = chatHistory;
    }

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

    return processedHistory;
  }
}
