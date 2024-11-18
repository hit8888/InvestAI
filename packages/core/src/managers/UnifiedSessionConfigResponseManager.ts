<<<<<<< HEAD:packages/core/src/managers/UnifiedSessionConfigResponseManager.ts
import { nanoid } from "nanoid";
import {
  ConfigurationApiResponse,
  ConfigurationSchema,
  SessionApiResponse,
  SessionSchema,
} from "../types/session";
import { Message } from "../types/chat";
=======
import { ChatBoxArtifactType, Message } from "@meaku/core/types/chat";
import {
  Configuration,
  ConfigurationSchema,
  Session,
  SessionSchema,
} from "@meaku/core/types/session";
import { nanoid } from "nanoid";
import { trackError } from "../utils/error";
import { ChatBoxArtifactEnumSchema } from "@meaku/core/types/artifact";
>>>>>>> main:apps/chatbot/src/managers/UnifiedResponseManager.ts

export type SessionConfigResponseType =
  | ConfigurationApiResponse
  | SessionApiResponse;

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

  private isSession(
    response: SessionConfigResponseType
  ): response is SessionApiResponse {
    return "session_id" in response;
  }

  private validateSession(session: SessionApiResponse) {
    const validatedSession = SessionSchema.safeParse(session);

    if (!validatedSession.success) {
      trackError(validatedSession.error.errors, {
        action: "validateSession",
        component: "UnifiedResponseManager",
      });

      throw new Error(
        validatedSession.error.errors.map((error) => error.message).join(", ")
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
      trackError(validatedConfig.error.errors, {
        action: "validateConfig",
        component: "UnifiedResponseManager",
      });

      throw new Error(
        validatedConfig.error.errors.map((error) => error.message).join(", ")
      );
    }

    return validatedConfig.data;
  }

  getSessionId() {
    return this.session?.session_id;
  }

  getProspectId() {
    return this.session?.prospect_id ?? "";
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
    isAdmin,
    isReadOnly,
  }: {
    isAdmin: boolean;
    isReadOnly: boolean;
  }): Message[] {
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

<<<<<<< HEAD:packages/core/src/managers/UnifiedSessionConfigResponseManager.ts
    const formattedChatHistory = chatHistory.map((message, idx) => {
      const messageFeedback = feedbacks.find(
        (feedback) =>
          feedback.response_id === message.response_id ||
          feedback.response_id === message.message_id.toString()
      );
=======
    const formattedChatHistory = chatHistory
      .filter((message) => message.type === "text")
      .map((message, idx) => {
        const messageFeedback = feedbacks.find(
          (feedback) =>
            feedback.response_id === message.response_id ||
            feedback.response_id === message.message_id.toString(),
        );
>>>>>>> main:apps/chatbot/src/managers/UnifiedResponseManager.ts

        // TODO: Replace this with the chat artifact enums created by Amogh
        const ArtifactTypesToIgnore = ["SUGGESTIONS", "FORM", "NONE"];
        const messageArtifact = message.artifacts.find(
          (artifact) =>
            !ArtifactTypesToIgnore.includes(artifact.artifact_type) &&
            artifact.artifact_id,
        );

        const chatBoxArtifact = message.artifacts.find((artifact) =>
          ChatBoxArtifactEnumSchema.options.includes(
            artifact.artifact_type as ChatBoxArtifactType,
          ),
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
          chatArtifact: chatBoxArtifact,
        };
      });

    return [welcomeMessage, ...formattedChatHistory];
  }

  getDefaultErrorMessage() {
    return this.config.body.default_error_message;
  }

  getInitialSuggestedQuestions({
    isAdmin,
    isReadOnly,
  }: {
    isAdmin: boolean;
    isReadOnly: boolean;
  }) {
    const chatHistory = this.getFormattedChatHistory({ isAdmin, isReadOnly });

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
