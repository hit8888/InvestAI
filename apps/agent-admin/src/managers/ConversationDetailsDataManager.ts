import { ConversationDetailsDataResponse, ConversationsTableViewContent } from '@meaku/core/types/admin/admin';
import { ConversationDetailsResponseSchema } from '@meaku/core/types/admin/api';
import { convertServerConversationDataToClientConversationData } from '@meaku/core/transformers/common';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/index';

/**
 * This is an ConversationDetailsDataResponseManager that helps us manage the response for the Conversation Details API.
 * This has been made into a single manager to avoid code duplication and to make the code more maintainable.
 */

class ConversationDetailsDataResponseManager {
  private convDetailsData: ConversationDetailsDataResponse;

  constructor(response: ConversationDetailsDataResponse) {
    const validatedDetailsData = this.validateDetailsData(response);
    this.convDetailsData = validatedDetailsData;
  }

  private validateDetailsData(convDetailsData: ConversationDetailsDataResponse) {
    const validateDetailsData = ConversationDetailsResponseSchema.safeParse(convDetailsData);

    if (!validateDetailsData.success) {
      throw new Error(validateDetailsData.error.errors.map((error) => error.message).join(', '));
    }

    return validateDetailsData.data;
  }

  getFormattedChatHistory(): WebSocketMessage[] {
    return this.convDetailsData.chat_history;
  }

  getFeedback(): FeedbackRequestPayload[] {
    return this.convDetailsData.feedback ?? [];
  }

  getFormattedConversationData() {
    return {
      ...convertServerConversationDataToClientConversationData(
        this.convDetailsData?.conversation as ConversationsTableViewContent,
      ),
    };
  }
}

export default ConversationDetailsDataResponseManager;
