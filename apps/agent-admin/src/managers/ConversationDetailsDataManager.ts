import { ConversationDetailsDataResponse, ConversationsTableViewContent } from '@meaku/core/types/admin/admin';
import { ConversationDetailsResponseSchema } from '@meaku/core/types/admin/api';
import {
  convertServerChatHistoryToClientChatHistory,
  convertServerConversationDataToClientConversationData,
} from '@meaku/core/transformers/common';
import { Message } from '@meaku/core/types/agent';

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
      // console.error("Validation failed for ConversationDetailsDataResponseManager:", {
      //   input: convDetailsData,
      //   errors: validateDetailsData.error.format(),
      // });
      throw new Error(validateDetailsData.error.errors.map((error) => error.message).join(', '));
    }

    return validateDetailsData.data;
  }

  getFormattedChatHistory({ isAdmin, isReadOnly }: { isAdmin: boolean; isReadOnly: boolean }): Message[] {
    return convertServerChatHistoryToClientChatHistory({
      isAdmin,
      isReadOnly,
      responseObject: this.convDetailsData,
      ForAgentChatbot: false,
    });
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
