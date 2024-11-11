
import { nanoid } from "nanoid";
import { ConfigurationApiResponse, ConfigurationSchema, SessionApiResponse, SessionSchema } from "../types/session";
import { Message } from "../types/chat";

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
    return "session_id" in response;
  }

  private validateSession(session: SessionApiResponse) {
    const validatedSession = SessionSchema.safeParse(session);

    if (!validatedSession.success) {
      throw new Error(
        validatedSession.error.errors.map((error) => error.message).join(", "),
      );
    }

    return {
      session: validatedSession.data,
      config: validatedSession.data.configuration,
    };
  }

  private validateConfig(config: ConfigurationApiResponse) {
    const validatedConfig = ConfigurationSchema.safeParse(config);

    if (!validatedConfig.success) {
      throw new Error(
        validatedConfig.error.errors.map((error) => error.message).join(", "),
      );
    }

    return validatedConfig.data;
  }

  getSessionId() {
    return this.session?.session_id;
  }

  getProspectId() {
    return this.session?.prospect_id;
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

  getFormattedChatHistory({
    isAdmin = false,
    isReadOnly = false,
  }: {
    isAdmin?: boolean;
    isReadOnly?: boolean;
  } = {}): Message[] {
    const chatHistory = this.config.body.chat_history ?? [];
    const feedbacks = this.config.body.feedback ?? [];

    const welcomeMessage: Message = {
      id: nanoid(),
      message: this.config.body.welcome_message.message,
      role: "ai",
      isPartOfHistory: false,
      is_complete: true,
      showFeedbackOptions: false,
      documents: [],
      media: null,
      analytics: {},
    };

    const formattedChatHistory = chatHistory.map((message, idx) => {
      const messageFeedback = feedbacks.find(
        (feedback) =>
          feedback.response_id === message.response_id ||
          feedback.response_id === message.message_id.toString(),
      );

      return {
        id: message.message_id,
        message: message.message,
        media: message.media,
        documents: message.documents,
        role: message.role,
        suggested_questions: message.suggested_questions,
        isPartOfHistory: true,
        is_complete: true,
        showFeedbackOptions: isAdmin && message.role === "ai" && idx > 0,
        feedback: messageFeedback,
        isReadOnly,
        analytics: message.analytics,
      };
    });

    return [welcomeMessage, ...formattedChatHistory];
  }


  getDefaultErrorMessage() {
    return this.config.body.default_error_message;
  }

  getSuggestedQuestions() {
    const chatHistory = this.getFormattedChatHistory();

    if (chatHistory.length > 1) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      return lastMessage.suggested_questions ?? [];
    }

    return this.config.body.welcome_message.suggested_questions;
  }

  getStyleConfig() {
    return this.config.style_config;
  }

  getConfig() {
    const config = this.config;
    const isOrgC2FO = config.org_name === "C2FO";

    if (isOrgC2FO) {
      config.body.disclaimer_message =
        "If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support.";
    }

    config.body.show_cta = false;

    return config;
  }
}

export default UnifiedSessionConfigResponseManager;
