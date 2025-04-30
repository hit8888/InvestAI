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
    const transformedResponse = this.getTransformedResponse(response);
    const validatedDetailsData = this.validateDetailsData(transformedResponse);
    this.convDetailsData = validatedDetailsData;
  }

  private validateDetailsData(convDetailsData: ConversationDetailsDataResponse) {
    const validateDetailsData = ConversationDetailsResponseSchema.safeParse(convDetailsData);

    if (!validateDetailsData.success) {
      // console.error('Validation failed for ConversationDetailsDataManager:', {
      //   input: convDetailsData,
      //   errors: validateDetailsData.error,
      // });
      throw new Error(validateDetailsData.error.errors.map((error) => error.message).join(', '));
    }

    return validateDetailsData.data;
  }

  private getTransformedResponse(response: ConversationDetailsDataResponse) {
    return { ...response, chat_history: response.chat_history.map((message) => this.transformMessage(message)) };
  }

  private transformMessage(message: WebSocketMessage) {
    // Create a deep copy of the message
    const transformedMessage = JSON.parse(JSON.stringify(message));

    // Check if it's an EVENT message with DISCOVERY_QUESTIONS
    if (
      transformedMessage.message_type === 'EVENT' &&
      transformedMessage.message?.event_type === 'DISCOVERY_QUESTIONS' &&
      transformedMessage.message?.event_data?.response_options
    ) {
      // Filter out empty strings from response_options
      transformedMessage.message.event_data.response_options =
        transformedMessage.message.event_data.response_options.filter((option: string) => option !== '');
    }

    return transformedMessage;
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
