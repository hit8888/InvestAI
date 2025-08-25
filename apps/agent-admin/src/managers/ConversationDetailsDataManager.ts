import { ConversationDetailsDataResponse, ConversationsTableViewContent } from '@meaku/core/types/admin/admin';
// import { ConversationDetailsResponseSchema } from '@meaku/core/types/admin/api';
import { convertServerConversationDataToClientConversationData } from '@meaku/core/transformers/common';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/index';
import { getTransformedResponse } from '@meaku/core/utils/index';

type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * This is an ConversationDetailsDataResponseManager that helps us manage the response for the Conversation Details API.
 * This has been made into a single manager to avoid code duplication and to make the code more maintainable.
 */

class ConversationDetailsDataResponseManager {
  private convDetailsData: ConversationDetailsDataResponse | null = null;
  private error: string | null = null;

  constructor(response: ConversationDetailsDataResponse) {
    const transformedResponse = getTransformedResponse(response);
    const result = this.validateDetailsData(transformedResponse);

    if (result.success && result.data) {
      this.convDetailsData = result.data;
    } else {
      this.error = result.error || 'Failed to validate conversation details data';
    }
  }

  private validateDetailsData(
    convDetailsData: ConversationDetailsDataResponse,
  ): Result<ConversationDetailsDataResponse> {
    // const validateDetailsData = ConversationDetailsResponseSchema.safeParse(convDetailsData);

    // if (!validateDetailsData.success) {
    //   // console.error('Validation failed for ConversationDetailsDataManager:', {
    //   //   input: convDetailsData,
    //   //   errors: validateDetailsData.error,
    //   // });
    //   return {
    //     success: false,
    //     error: validateDetailsData.error.errors.map((error) => error.message).join(', '),
    //   };
    // }

    return {
      success: true,
      data: convDetailsData,
    };
  }

  hasError(): boolean {
    return this.error !== null;
  }

  getError(): string | null {
    return this.error;
  }

  getFormattedChatHistory(): WebSocketMessage[] {
    if (!this.convDetailsData) {
      return [];
    }
    return this.convDetailsData.chat_history;
  }

  getFeedback(): FeedbackRequestPayload[] {
    if (!this.convDetailsData) {
      return [];
    }
    return this.convDetailsData.feedback ?? [];
  }

  getFormattedConversationData() {
    if (!this.convDetailsData) {
      return null;
    }
    return {
      ...convertServerConversationDataToClientConversationData(
        this.convDetailsData?.conversation as ConversationsTableViewContent,
      ),
    };
  }
}

export default ConversationDetailsDataResponseManager;
