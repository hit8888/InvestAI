import useInView from '@meaku/core/hooks/useInView';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ChatArtifact from './ChatArtifact.tsx';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { getMessageTimestamp, isArtifactMessage, isMessageAnalyticsEvent } from '@meaku/core/utils/index';
import { WebSocketMessage, ArtifactBaseType } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { FormArtifactContent, SuggestionArtifactContent } from '@meaku/core/types/artifact';
import MessageArtifactPreview from './MessageArtifactPreview';
import TextMessage from './TextMessage';
import { useState } from 'react';
import MessageAnalytics from './MessageAnalytics';
import MessageDataSources from './MessageDataSources';
import MessageFeedback from './MessageFeedback';
import { isCompleteMessage } from '@meaku/core/utils/messageUtils';

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
    (message.message_type === 'EVENT' && message.message.event_type === 'SLIDE_ITEM_CLICKED');

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === message.response_id);
  const streamMessage = messagesWithSameResponseId.find((msg) => msg.message_type === 'STREAM');
  const hasMessageStreamed = streamMessage ? isCompleteMessage(streamMessage) : true;

  const showArtifactPreview = messageIndex >= totalMessages - 4;
  const isLastQuestionResponse = lastMessageResponseId === message.response_id && message.message_type === 'STREAM';
  const [feedback, setFeedback] = useState<FeedbackRequestPayload | undefined>(initialFeedback);
  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const showMessageArtifactPreview =
    !isLastQuestionResponse &&
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

  return (
    <div ref={inViewRef}>
      {/* Text Message */}
      {isTextMessage && (
        <TextMessage
          message={message}
          isAiMessage={isAiMessage}
          usingForAgent={usingForAgent}
          isLastQuestionResponse={isLastQuestionResponse}
          orbState={orbState}
          primaryColor={primaryColor}
          isAMessageBeingProcessed={isAMessageBeingProcessed}
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
          {isMessageAnalyticsEvent(message) && <MessageAnalytics analytics={message.message.event_data} />}
        </div>
      )}

      {/* Ai Message Artifact Preview */}
      {showMessageArtifactPreview && (
        <MessageArtifactPreview
          message={message}
          usingForAgent={usingForAgent}
          setDemoPlayingStatus={setDemoPlayingStatus}
          setActiveArtifact={setActiveArtifact}
          logoURL={logoURL}
        />
      )}

      {/* Form Artifact */}
      {isArtifactMessage(message) && message.message.artifact_type === 'FORM' && hasMessageStreamed && (
        <div className="flex flex-col items-start pl-11">
          <ChatArtifact
            artifact={{
              artifact_type: message.message.artifact_type,
              artifact_id: message.message.artifact_data.artifact_id,
              content: message.message.artifact_data.content as FormArtifactContent,
              metadata: message.message.artifact_data.metadata,
              error: message.message.artifact_data.error,
              error_code: message.message.artifact_data.error_code,
            }}
            handleSendUserMessage={handleSendUserMessage}
          />
        </div>
      )}

      {/* Suggestions Section */}
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
          <ChatArtifact
            artifact={{
              artifact_type: message.message.artifact_type,
              artifact_id: message.message.artifact_data.artifact_id,
              content: message.message.artifact_data.content as SuggestionArtifactContent,
              metadata: message.message.artifact_data.metadata,
              error: message.message.artifact_data.error,
              error_code: message.message.artifact_data.error_code,
            }}
            handleSendUserMessage={handleSendUserMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
