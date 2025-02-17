import { ChatHistory, WebSocketMessage } from '../types/webSocketData';
import { ConfigurationApiResponse, ConfigurationSchema } from '../types/api/configuration_response';
import { SessionApiResponse, SessionSchema } from '../types/api/session_init_response';
import { filterOutSuggestions } from '../utils/messageUtils';

export type SessionConfigResponseType = ConfigurationApiResponse | SessionApiResponse;

/**
 * This is an UnifiedResponseManager that helps us manage the response for the initialization api as well as the config api. This has been made into a single manager to avoid code duplication and to make the code more maintainable.
 */

class UnifiedSessionConfigResponseManager {
  private config: ConfigurationApiResponse;
  private session: SessionApiResponse | null = null;

  constructor(response: SessionConfigResponseType) {
    if (this.isSession(response)) {
      const { config, session } = this.validateSession(response);
      this.session = session;
      this.config = config;
    } else {
      this.config = this.validateConfig(response);
    }
  }

  private isSession(response: SessionConfigResponseType): response is SessionApiResponse {
    return 'session_id' in response;
  }

  private validateSession(session: SessionApiResponse) {
    const validatedSession = SessionSchema.safeParse(session);

    if (!validatedSession.success) {
      console.error(validatedSession.error.errors);
      throw new Error(validatedSession.error.errors.map((error) => error.message).join(', '));
    }

    return {
      session: validatedSession.data,
      config: validatedSession.data.configuration,
    };
  }

  private validateConfig(config: ConfigurationApiResponse) {
    const validatedConfig = ConfigurationSchema.safeParse(config);

    if (!validatedConfig.success) {
      throw new Error(validatedConfig.error.errors.map((error) => error.message).join(', '));
    }

    return validatedConfig.data;
  }

  getSessionId() {
    return this.session?.session_id;
  }

  getProspectId() {
    return this.session?.prospect_id ?? '';
  }

  getAgentId() {
    return this.session?.agent_id;
  }

  getAgentName() {
    return this.config.agent_name;
  }

  getOrgName() {
    return this.config.org_name;
  }

  getLogoUrl() {
    return this.config.logo;
  }

  getFormattedChatHistory(welcomeMessagePayload?: WebSocketMessage): ChatHistory {
    let history = welcomeMessagePayload
      ? [welcomeMessagePayload, ...this.config.body.chat_history]
      : this.config.body.chat_history;

    // For each response_id where role is 'ai', ensure STREAM comes before TEXT
    const processedHistory = [...history];
    for (let i = 0; i < processedHistory.length; i++) {
      const currentMsg = processedHistory[i];
      if (currentMsg.role === 'ai' && currentMsg.message_type === 'TEXT') {
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

  getDefaultErrorMessage() {
    return this.config.body.default_error_message;
  }

  getInitialSuggestedQuestions() {
    return this.config.body.welcome_message.suggested_questions;
  }

  getStyleConfig() {
    return this.config.style_config;
  }

  getBottomBarConfig() {
    return this.config.body.bottom_bar_config;
  }

  getCTAConfig() {
    return this.config.body.cta_config;
  }

  getConfig() {
    const config = this.config;
    return config;
  }
}

export default UnifiedSessionConfigResponseManager;
