import { Message } from "@meaku/core/types/chat";
import {
  Configuration,
  ConfigurationSchema,
  Session,
  SessionSchema,
} from "@meaku/core/types/session";
import { nanoid } from "nanoid";

type ResponseType = Configuration | Session;

/**
 * This is an UnifiedResponseManager that helps us manage the response for the initialization api as well as the config api. This has been made into a single manager to avoid code duplication and to make the code more maintainable.
 */

class UnifiedResponseManager {
  private config: Configuration;
  private session: Session | null = null;

  constructor(response: ResponseType) {
    if (this.isSession(response)) {
      const validatedSession = this.validateSession(response);
      this.session = validatedSession.session;
      this.config = validatedSession.config;
    } else {
      this.config = this.validateConfig(response);
    }
  }

  private isSession(response: ResponseType): response is Session {
    return "session_id" in response;
  }

  private validateSession(session: Session) {
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

  private validateConfig(config: Configuration) {
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
    const documents = this.config.body.documents ?? [];

    const welcomeMessage: Message = {
      id: nanoid(),
      message: this.config.body.welcome_message.message,
      role: "ai",
      isPartOfHistory: false,
      is_complete: true,
      showFeedbackOptions: false,
      documents: [],
      media: null,
    };

    const formattedChatHistory = chatHistory.map((message, idx) => {
      const relevantDcouments = documents.find(
        (document) => document.response_id === message.response_id,
      );
      const messageDocuments = (relevantDcouments?.data_sources ?? []).map(
        (document) => ({
          ...document,
          url: document.url ?? "",
          title: document.title ?? "",
        }),
      );
      const messageFeedback = feedbacks.find(
        (feedback) =>
          feedback.response_id === message.response_id ||
          feedback.response_id === message.message_id.toString(),
      );

      return {
        id: message.message_id,
        message: message.message,
        media: message.media,
        documents: messageDocuments,
        role: message.role,
        suggested_questions: message.suggested_questions,
        isPartOfHistory: true,
        is_complete: true,
        showFeedbackOptions: isAdmin && message.role === "ai" && idx > 0,
        feedback: messageFeedback,
        isReadOnly,
      };
    });

    return [welcomeMessage, ...formattedChatHistory];
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
    return this.config;
  }
}

export default UnifiedResponseManager;
