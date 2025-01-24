import { nanoid } from "nanoid";
import {
  AIResponse,
  ChatBoxArtifactType,
  ConfigurationBodyApiResponse,
  Message,
} from "../types";
import {
  ConversationDetailsDataResponse,
  ConversationsTableDisplayContent,
  ConversationsTableViewContent,
} from "../types/admin/admin";
import { ChatBoxArtifactEnumSchema } from "../types/artifact";

const ArtifactTypesToIgnore = ["SUGGESTIONS", "FORM", "NONE"];

export const convertServerMessageToClientMessage = (
  response: AIResponse
): Message => {
  const messageArtifact = response.artifacts.find(
    (artifact) =>
      !ArtifactTypesToIgnore.includes(artifact.artifact_type) &&
      artifact.artifact_id
  );

  const chatBoxArtifact = response.artifacts.find((artifact) =>
    ChatBoxArtifactEnumSchema.options.includes(
      artifact.artifact_type as ChatBoxArtifactType
    )
  );

  return {
    message: response.message,
    documents: response.documents,
    is_loading: response.is_loading,
    is_complete: response.is_complete,
    showFeedbackOptions: response.showFeedbackOptions,
    analytics: response.analytics,
    artifact: messageArtifact,
    chatArtifact: chatBoxArtifact,
    scriptStep: response.script_step,
    demoAvailable: response.demo_available,
    features: response.features ?? [],
    role: response.role,
    id: response.response_id,
    timestamp: response.timestamp,
    response_audio_url: response.response_audio_url,
  };
};

export const convertServerChatHistoryToClientChatHistory = ({
  isAdmin,
  isReadOnly,
  responseObject,
  ForAgentChatbot,
}: {
  isAdmin: boolean;
  isReadOnly: boolean;
  responseObject:
    | ConfigurationBodyApiResponse
    | ConversationDetailsDataResponse;
  ForAgentChatbot: boolean;
}): Message[] => {
  const chatHistory = responseObject.chat_history ?? [];
  const feedbacks = responseObject.feedback ?? [];

  const welcomeMessage: Message = {
    id: nanoid(),
    message: (responseObject as ConfigurationBodyApiResponse)?.welcome_message
      ?.message,
    role: "ai",
    is_complete: true,
    showFeedbackOptions: false,
    documents: [],
    analytics: {},
    features: [],
  };

  const formattedChatHistory = chatHistory
    .filter((message) => message.type === "text")
    .map((message, idx) => {
      const messageFeedback = feedbacks.find(
        (feedback) =>
          feedback.response_id === message.response_id ||
          feedback.response_id === message.message_id.toString()
      );

      return {
        ...convertServerMessageToClientMessage(message),
        suggested_questions: message.suggested_questions,
        is_complete: true,
        is_loading: false,
        showFeedbackOptions: isAdmin && message.role === "ai" && idx > 0,
        feedback: messageFeedback,
        isReadOnly,
      };
    });

  if (ForAgentChatbot) {
    return [welcomeMessage, ...formattedChatHistory];
  } else {
    return [...formattedChatHistory];
  }
};

export const convertServerConversationDataToClientConversationData = (
  response: ConversationsTableViewContent
): ConversationsTableDisplayContent => {
  return {
    company: response.company || "Unknown Company",
    name: response.name || "Anonymous",
    email: response.email || "Not provided",
    timestamp: response.timestamp
      ? new Date(response.timestamp)
          .toISOString()
          .replace("T", " ")
          .split(".")[0]
      : "N/A",
    conversation_preview: response.summary || "No conversation preview",
    location: response.country || "N/A",
    buyer_intent: "N/A", // Need to Find Logic or Directly getting from api
    bant_analysis: "N/A", // Need to Find Logic or Directly getting from api
    number_of_user_messages: `${response.user_message_count || 0}`,
    meeting_status: "N/A", // Static for now, can be dynamic if additional info is provided
    product_of_interest: response.product_of_interest || "No product specified",
    ip_address: response.ip_address || "IP not available",
    session_id: response.session_id || "Session ID missing",
  };
};
