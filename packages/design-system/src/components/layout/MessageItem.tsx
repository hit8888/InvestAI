import useInView from '@meaku/core/hooks/useInView';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ChatArtifact from './ChatArtifact.tsx';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { getMessageTimestamp } from '@meaku/core/utils/index';
import {
  ArtifactBaseType,
  ArtifactMessageContent,
  MessageAnalyticsEventData,
  WebSocketMessage,
} from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { FormArtifactContent, SuggestionArtifactContent } from '@meaku/core/types/artifact';
import MessageArtifactPreview from './MessageArtifactPreview';
import TextMessage from './TextMessage';
import { useState } from 'react';
import MessageAnalytics from './MessageAnalytics';
import MessageDataSources from './MessageDataSources';
import MessageFeedback from './MessageFeedback';
import MessageItemErrorBoundary from './MessageItemErrorBoundary';
import {
  checkIsArtifactMessage,
  checkIsDiscoveryMessage,
  checkIsMainResponseMessage,
  checkIsSalesResponseComplete,
  getAnalyticsEvent,
  getFormArtifactMessage,
  getFormFilledEvent,
  getSuggestionsArtifactMessage,
  isDisplayedAsTextMessage,
} from '@meaku/core/utils/messageUtils';

interface IProps {
  isAMessageBeingProcessed: boolean;
  usingForAgent: boolean;
  message: WebSocketMessage;
  messages: WebSocketMessage[];
  sessionId: string;
  primaryColor: string | null;
  messageIndex: number;
  totalMessages: number;
  orbState: OrbStatusEnum;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  allowFeedback: boolean;
  logoURL: string | null;
  initialFeedback?: FeedbackRequestPayload;
  lastMessageResponseId: string;
}

const MessageItem = ({
  isAMessageBeingProcessed,
  usingForAgent,
  message,
  messages,
  sessionId,
  primaryColor,
  messageIndex,
  totalMessages,
  orbState,
  setDemoPlayingStatus,
  setActiveArtifact,
  handleSendUserMessage,
  allowFeedback,
  logoURL,
  initialFeedback,
  lastMessageResponseId,
}: IProps) => {
  const { isInView, ref: inViewRef } = useInView(0, true);
  const isAiMessage = message.role === 'ai';
  const isTextMessage = isDisplayedAsTextMessage(message);
  const isArtifactMessage = checkIsArtifactMessage(message);
  const isSalesResponseMessage = checkIsMainResponseMessage(message);
  const isDiscoveryMessage = checkIsDiscoveryMessage(message);

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === message.response_id);
  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const analyticsEvent = getAnalyticsEvent(messagesWithSameResponseId);
  const isAnalyticsEvent = !!analyticsEvent;

  const suggestionsArtifactMessage = getSuggestionsArtifactMessage(messagesWithSameResponseId);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const formFilledMessage = getFormFilledEvent(messages, formArtifactMessage);

  const hasFormArtifactMessage = !!formArtifactMessage;
  const hasFormFilledMessage = !!formFilledMessage;

  const isLastQuestionResponse = lastMessageResponseId === message.response_id && isSalesResponseMessage;
  const isLoading = isAMessageBeingProcessed && isLastQuestionResponse;

  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const shouldShowActiveOrb =
    lastMessageResponseId === message.response_id &&
    (!isSalesResponseComplete || isLoading || message.message_type === 'LOADING_TEXT');

  const showArtifactPreview = messageIndex >= totalMessages - 4;

  const showMessageArtifactPreview =
    lastMessageResponseId !== message.response_id &&
    isArtifactMessage &&
    message.message.artifact_type !== 'NONE' &&
    (showArtifactPreview || isInView) &&
    isSalesResponseComplete;

  const [feedback, setFeedback] = useState<FeedbackRequestPayload | undefined>(initialFeedback);

  const handleAddFeedback = (newFeedback: Partial<FeedbackRequestPayload>) => {
    const updatedFeedback = {
      ...newFeedback,
      positive_feedback: newFeedback.positive_feedback ?? false,
    };

    if (updatedFeedback.positive_feedback) {
      delete updatedFeedback.category;
    }

    setFeedback(updatedFeedback as FeedbackRequestPayload);
  };

  const handleRemoveFeedback = () => {
    setFeedback(undefined);
  };

  const getMessageArtifactPreviewContent = (message: WebSocketMessage) => {
    return (
      <MessageArtifactPreview
        message={message}
        usingForAgent={usingForAgent}
        setDemoPlayingStatus={setDemoPlayingStatus}
        setActiveArtifact={setActiveArtifact}
        logoURL={logoURL}
      />
    );
  };

  const getChatArtifactContent = (
    message: WebSocketMessage & { message: ArtifactMessageContent },
    isFormArtifact: boolean = false,
  ) => {
    const formMetadata = isFormArtifact &&
      hasFormFilledMessage &&
      formFilledMessage.message.event_data &&
      !usingForAgent && {
        is_filled: hasFormFilledMessage,
        filled_data: hasFormFilledMessage ? formFilledMessage.message.event_data.form_data : undefined,
      };

    return (
      isArtifactMessage && (
        <ChatArtifact
          artifact={{
            artifact_type: message.message.artifact_type,
            artifact_id: message.message.artifact_data.artifact_id,
            content: isFormArtifact
              ? (message.message.artifact_data.content as FormArtifactContent)
              : (message.message.artifact_data.content as SuggestionArtifactContent),
            metadata: {
              ...message.message.artifact_data.metadata,
              ...formMetadata,
            },
            error: message.message.artifact_data.error,
            error_code: message.message.artifact_data.error_code,
          }}
          handleSendUserMessage={handleSendUserMessage}
          isformDisabled={!usingForAgent && isFormArtifact}
        />
      )
    );
  };

  const showingContentForAdmin = !usingForAgent && isAiMessage && isTextMessage;

  return (
    <MessageItemErrorBoundary messageId={message.response_id}>
      <div ref={inViewRef}>
        {/* Text Message */}
        {isTextMessage && message.message.content !== '' && (isDiscoveryMessage ? isSalesResponseComplete : true) && (
          <TextMessage
            message={message}
            isAiMessage={isAiMessage}
            usingForAgent={usingForAgent}
            isLastQuestionResponse={isLastQuestionResponse}
            orbState={orbState}
            primaryColor={primaryColor}
            shouldShowActiveOrb={shouldShowActiveOrb}
          />
        )}

        {isAiMessage && allowFeedback && isTextMessage && (
          <div className="pl-11">
            <MessageDataSources dataSources={message.documents ?? []} />
            {!usingForAgent && <p className="mt-2 w-full text-xs font-medium text-gray-400">{formattedTimestamp}</p>}
            {isSalesResponseComplete && (
              <MessageFeedback
                sessionId={sessionId}
                message={message}
                feedback={feedback}
                onAddFeedback={handleAddFeedback}
                onRemoveFeedback={handleRemoveFeedback}
              />
            )}
            {isAnalyticsEvent && !isDiscoveryMessage && (
              <MessageAnalytics analytics={analyticsEvent.message.event_data as MessageAnalyticsEventData} />
            )}
          </div>
        )}

        {usingForAgent ? (
          <>
            {showMessageArtifactPreview ? <>{getMessageArtifactPreviewContent(message)}</> : null}

            {/* Form Artifact */}
            {isSalesResponseComplete && isArtifactMessage && message.message.artifact_type === 'FORM' && (
              <div className="flex flex-col items-start pl-11">
                {getChatArtifactContent(message as WebSocketMessage & { message: ArtifactMessageContent }, true)}
              </div>
            )}

            <div className="ml-auto mt-3">
              {/* Show suggestion artifacts - store handles filtering */}
              {isSalesResponseComplete && isArtifactMessage && message.message.artifact_type === 'SUGGESTIONS' && (
                <>{getChatArtifactContent(message as WebSocketMessage & { message: ArtifactMessageContent })}</>
              )}
            </div>
          </>
        ) : null}

        {showingContentForAdmin ? (
          <>
            {suggestionsArtifactMessage && !isDiscoveryMessage && (
              <>{getMessageArtifactPreviewContent(suggestionsArtifactMessage)}</>
            )}

            {/* Form Artifact */}
            {hasFormArtifactMessage && (
              <div className="flex flex-col items-start pl-11 pt-2">
                {getChatArtifactContent(
                  formArtifactMessage as WebSocketMessage & { message: ArtifactMessageContent },
                  true,
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </MessageItemErrorBoundary>
  );
};

export default MessageItem;
