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

  getFormattedChatHistory({
    isAdmin = false,
    isReadOnly = false,
  }: {
    isAdmin?: boolean;
    isReadOnly?: boolean;
  } = {}): Message[] {
    const chatHistory = this.session.configuration.body.chat_history;
    const feedbacks = this.session.configuration.body.feedback ?? [];
    const documents = this.session.configuration.body.documents ?? [];

    return chatHistory.map((message, idx) => {
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
  }

  getSuggestedQuestions() {
    const formattedChatHistory = this.getFormattedChatHistory();

    if (formattedChatHistory.length === 0) return [];

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
