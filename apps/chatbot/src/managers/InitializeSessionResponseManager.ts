import { Message } from "@meaku/core/types/chat";
import { Session, SessionSchema } from "@meaku/core/types/session";

class InitializeSessionResponseManager {
  private session: Session;

  constructor(session: Session) {
    const validatedSession = SessionSchema.safeParse(session);

    if (!validatedSession.success) {
      throw new Error("Invalid session data");
    }

    this.session = validatedSession.data;
  }

  getSessionId() {
    return this.session.session_id;
  }

  getAgentId() {
    return this.session.agent_id;
  }

  getOrgName() {
    return this.session.configuration.org_name;
  }

  getFormattedChatHistory(isAdmin: boolean = false): Message[] {
    const chatHistory = this.session.configuration.body.chat_history;
    return chatHistory.map((message, idx) => ({
      id: message.message_id,
      message: message.message,
      media: message.media,
      documents: message.documents,
      role: message.role,
      suggested_questions: message.suggested_questions,
      isPartOfHistory: true,
      is_complete: true,
      showFeedbackOptions: isAdmin && message.role === "ai" && idx > 0,
    }));
  }

  getSuggestedQuestions() {
    const formattedChatHistory = this.getFormattedChatHistory();

    return (
      formattedChatHistory[formattedChatHistory.length - 1]
        .suggested_questions ?? []
    );
  }

  getStyleConfig() {
    return this.session.configuration.style_config;
  }
}

export default InitializeSessionResponseManager;
