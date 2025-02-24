import useInView from '@meaku/core/hooks/useInView';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ChatArtifact from './ChatArtifact.tsx';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { getMessageTimestamp, isArtifactMessage, isMessageAnalyticsEvent } from '@meaku/core/utils/index';
import { WebSocketMessage, ArtifactBaseType, MessageAnalyticsEventData } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { FormArtifactContent, SuggestionArtifactContent } from '@meaku/core/types/artifact';
import MessageArtifactPreview from './MessageArtifactPreview';
import TextMessage from './TextMessage';
import { useState } from 'react';
import MessageAnalytics from './MessageAnalytics';
import MessageDataSources from './MessageDataSources';
import MessageFeedback from './MessageFeedback';
import {
  isCompleteMessage,
  isFormArtifactEvent,
  isFormFilledEvent,
  isSuggestionArtifact,
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
  initialSuggestedQuestions: string[];
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
  initialSuggestedQuestions,
  allowFeedback,
  logoURL,
  initialFeedback,
  lastMessageResponseId,
}: IProps) => {
  const { isInView, ref: inViewRef } = useInView(0, true);
  const isAiMessage = message.role === 'ai';
  const isTextMessage =
    message.message_type === 'TEXT' ||
    message.message_type === 'STREAM' ||
    (message.message_type === 'EVENT' && message.message.event_type === 'SUGGESTED_QUESTION_CLICKED') ||
    (message.message_type === 'EVENT' && message.message.event_type === 'SLIDE_ITEM_CLICKED') ||
    message.message_type === 'LOADING_TEXT';

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === message.response_id);
  const streamMessage = messagesWithSameResponseId.find((msg) => msg.message_type === 'STREAM');
  const hasMessageStreamed = streamMessage ? isCompleteMessage(streamMessage) : true;
  const hasTextMessage = messagesWithSameResponseId.some((msg) => msg.message_type === 'TEXT' && msg.role === 'ai');

  const analyticsEvent = messagesWithSameResponseId.find(
    (msg) => msg.message_type === 'EVENT' && msg.message.event_type === 'MESSAGE_ANALYTICS',
  );

  const formFilledMessage = messagesWithSameResponseId.find(
    (msg) => msg.message_type === 'EVENT' && msg.message.event_type === 'FORM_FILLED',
  );

  const artifactMessage = messagesWithSameResponseId.find(
    (msg) => msg.message_type === 'ARTIFACT' && msg.message.artifact_type !== 'SUGGESTIONS',
  );

  const suggestionsMessage = messagesWithSameResponseId.find(
    (msg) => msg.message_type === 'ARTIFACT' && msg.message.artifact_type === 'SUGGESTIONS',
  );

  const formMessage = messagesWithSameResponseId.find(
    (msg) => msg.message_type === 'ARTIFACT' && msg.message.artifact_type === 'FORM',
  );

  const hasFormArtifactMessage = formMessage && isArtifactMessage(formMessage) && isFormArtifactEvent(formMessage);
  const hasFormFilledMessage = formFilledMessage && isFormFilledEvent(formFilledMessage);
  const hasArtifactMessage = artifactMessage && isArtifactMessage(artifactMessage);
  const hasSuggestionsMessage =
    suggestionsMessage && isArtifactMessage(suggestionsMessage) && isSuggestionArtifact(suggestionsMessage);

  const isDiscoveryMessage = message.message_type === 'TEXT' && message.actor === 'DISCOVERY_QUESTIONS';

  const showArtifactPreview = messageIndex >= totalMessages - 4;

  const isLastQuestionResponse = lastMessageResponseId === message.response_id && message.message_type === 'STREAM';
  const isLoading = isAMessageBeingProcessed && isLastQuestionResponse;

  const shouldShowActiveOrb =
    lastMessageResponseId === message.response_id &&
    ((hasTextMessage && message.message_type === 'TEXT') ||
      (message.message_type === 'STREAM' && !hasTextMessage) ||
      isLoading ||
      message.message_type === 'LOADING_TEXT');

  const [feedback, setFeedback] = useState<FeedbackRequestPayload | undefined>(initialFeedback);
  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const showMessageArtifactPreview =
    (usingForAgent ? !lastMessageResponseId : hasArtifactMessage) &&
    isArtifactMessage(message) &&
    message.message.artifact_type !== 'NONE' &&
    (usingForAgent ? showArtifactPreview || isInView : true) &&
    hasMessageStreamed;

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

  const getChatArtifactContent = (message: WebSocketMessage, isFormArtifact: boolean) => {
    return (
      isArtifactMessage(message) && (
        <ChatArtifact
          artifact={{
            artifact_type: message.message.artifact_type,
            artifact_id: message.message.artifact_data.artifact_id,
            content: isFormArtifact
              ? (message.message.artifact_data.content as FormArtifactContent)
              : (message.message.artifact_data.content as SuggestionArtifactContent),
            metadata: {
              ...message.message.artifact_data.metadata,
              ...(isFormArtifact &&
                hasFormFilledMessage &&
                formFilledMessage.message.event_data &&
                !usingForAgent && {
                  is_filled: hasFormFilledMessage,
                  filled_data: hasFormFilledMessage ? formFilledMessage.message.event_data.form_data : undefined,
                }),
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
    <div ref={inViewRef}>
      {/* Text Message */}
      {isTextMessage && message.message.content !== '' && (
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
          {hasMessageStreamed && (
            <MessageFeedback
              sessionId={sessionId}
              message={message}
              feedback={feedback}
              onAddFeedback={handleAddFeedback}
              onRemoveFeedback={handleRemoveFeedback}
            />
          )}
          {analyticsEvent && isMessageAnalyticsEvent(analyticsEvent) && !isDiscoveryMessage && (
            <MessageAnalytics analytics={analyticsEvent.message.event_data as MessageAnalyticsEventData} />
          )}
        </div>
      )}

      {usingForAgent ? (
        <>
          {showMessageArtifactPreview ? <>{getMessageArtifactPreviewContent(message)}</> : null}

          {/* Form Artifact */}
          {isArtifactMessage(message) && message.message.artifact_type === 'FORM' && hasMessageStreamed && (
            <div className="flex flex-col items-start pl-11">{getChatArtifactContent(message, true)}</div>
          )}

          <div className="ml-auto mt-3">
            {/* Only show initial suggestions when no messages */}
            {totalMessages < 1 && (
              <SuggestionsArtifact
                suggestedQuestionOrientation="left"
                handleSendUserMessage={handleSendUserMessage}
                artifact={{
                  suggested_questions: initialSuggestedQuestions,
                  suggested_questions_type: 'BUBBLE',
                }}
              />
            )}

            {/* Show suggestion artifacts - store handles filtering */}
            {isArtifactMessage(message) && message.message.artifact_type === 'SUGGESTIONS' && hasMessageStreamed && (
              <>{getChatArtifactContent(message, false)}</>
            )}
          </div>
        </>
      ) : null}

      {showingContentForAdmin ? (
        <>
          {artifactMessage && !isDiscoveryMessage ? <>{getMessageArtifactPreviewContent(artifactMessage)}</> : null}

          {/* Form Artifact */}
          {hasFormArtifactMessage && (
            <div className="flex flex-col items-start pl-11 pt-2">{getChatArtifactContent(formMessage, true)}</div>
          )}

          {/* Suggestions Section */}
          {hasSuggestionsMessage && (
            <div className="ml-auto mt-3">
              {/* Show suggestion artifacts - store handles filtering */}
              {getChatArtifactContent(suggestionsMessage, false)}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default MessageItem;
