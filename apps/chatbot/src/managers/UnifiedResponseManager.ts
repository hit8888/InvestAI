import { Message } from "@meaku/core/types/chat";
import {
  Configuration,
  ConfigurationSchema,
  Session,
  SessionSchema,
} from "@meaku/core/types/session";
import { nanoid } from "nanoid";
import { trackError } from "../utils/error";

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
      trackError(validatedSession.error.errors, {
        action: "validateSession",
        component: "UnifiedResponseManager",
      });

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
      trackError(validatedConfig.error.errors, {
        action: "validateConfig",
        component: "UnifiedResponseManager",
      });

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

    const formattedChatHistory = chatHistory
      .filter((message) => message.type === "text")
      .map((message, idx) => {
        const messageFeedback = feedbacks.find(
          (feedback) =>
            feedback.response_id === message.response_id ||
            feedback.response_id === message.message_id.toString(),
        );

        // TODO: Replace this with the chat artifact enums created by Amogh
        const ArtifactTypesToIgnore = ["SUGGESTIONS", "FORM", "NONE"];
        const messageArtifact = message.artifacts.find(
          (artifact) =>
            !ArtifactTypesToIgnore.includes(artifact.artifact_type) &&
            artifact.artifact_id,
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
          artifact: messageArtifact,
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

export default UnifiedResponseManager;
