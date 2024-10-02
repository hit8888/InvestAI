import { Message } from "@meaku/core/types/chat";
import { Session, SessionSchema } from "@meaku/core/types/session";

class InitializeSessionResponseManager {
  private session: Session;

  constructor(session: Session) {
    const validatedSession = SessionSchema.safeParse(session);

    if (!validatedSession.success) {
      console.log(validatedSession.error.errors);

      throw new Error(
        validatedSession.error.errors.map((error) => error.message).join(", "),
      );
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
    const feedbacks = this.session.configuration.body.feedback ?? [];

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
      feedback:
        feedbacks.find(
          (feedback) => feedback.response_id === message.message_id.toString(),
        ) ?? undefined,
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
