import { Message } from "@meaku/core/types/chat";
import { Configuration, ConfigurationSchema } from "@meaku/core/types/session";
import { nanoid } from "nanoid";

/**
 * Config and initialization api has the same response schema, thus re-using the session type
 */

class ConfigResponseManager {
  private config: Configuration;

  constructor(config: Configuration) {
    const validatedConfig = ConfigurationSchema.safeParse(config);

    if (!validatedConfig.success) {
      console.log(validatedConfig.error.errors);

      throw new Error(
        validatedConfig.error.errors.map((error) => error.message).join(", "),
      );
    }

    this.config = validatedConfig.data;
  }

  getAgentId() {
    return this.config.agent_id;
  }

  getOrgName() {
    return this.config.org_name;
  }

  getFormattedChatHistory(): Message[] {
    const welcomeMessage = this.config.body.welcome_message.message;

    const chatHistory: Message[] = [
      {
        id: nanoid(),
        message: welcomeMessage,
        role: "ai",
        isPartOfHistory: true,
        is_complete: true,
        showFeedbackOptions: false,
        documents: [],
        media: null,
      },
    ];

    return chatHistory;
  }

  getWelcomeMessage() {
    return this.config.body.welcome_message.message;
  }

  getSuggestedQuestions() {
    return this.config.body.welcome_message.suggested_questions;
  }

  getStyleConfig() {
    return this.config.style_config;
  }

  getConfig() {
    return this.config;
  }
}

export default ConfigResponseManager;
