import useInView from '@meaku/core/hooks/useInView';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ChatArtifact from './ChatArtifact.tsx';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import {
  getMessageTimestamp,
  isArtifactMessage,
  isMessageAnalyticsEvent,
  isStreamMessage,
} from '@meaku/core/utils/index';
import { WebSocketMessage, ArtifactBaseType } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { FormArtifactContent, SuggestionArtifactContent } from '@meaku/core/types/artifact';
import MessageArtifactPreview from './MessageArtifactPreview';
import TextMessage from './TextMessage';
import { useState } from 'react';
import MessageAnalytics from './MessageAnalytics';
import MessageDataSources from './MessageDataSources';
import MessageFeedback from './MessageFeedback';

interface IProps {
  isAMessageBeingProcessed: boolean;
  usingForAgent: boolean;
  message: WebSocketMessage;
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
  const isTextMessage = message.message_type === 'TEXT' || message.message_type === 'STREAM';
  const showArtifactPreview = messageIndex >= totalMessages - 4;
  const isLastQuestionResponse = lastMessageResponseId === message.response_id;
  const [feedback, setFeedback] = useState<FeedbackRequestPayload | undefined>(initialFeedback);
  const hasMessageStreamed = isStreamMessage(message) ? message.message.is_complete : false;
  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const showMessageArtifactPreview =
    !isLastQuestionResponse &&
    isArtifactMessage(message) &&
    message.message.artifact_type !== 'NONE' &&
    (usingForAgent ? showArtifactPreview || isInView : true);

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
        />
      )}

      {isAiMessage && allowFeedback && (
        <>
          {isMessageAnalyticsEvent(message) && <MessageAnalytics analytics={message.message.event_data} />}
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
        </>
      )}

      {/* Ai Message Artifact Preview */}
      {showMessageArtifactPreview && (
        <div className="mb-4">
          <MessageArtifactPreview
            message={message}
            usingForAgent={usingForAgent}
            setDemoPlayingStatus={setDemoPlayingStatus}
            setActiveArtifact={setActiveArtifact}
            logoURL={logoURL}
          />
        </div>
      )}

      {/* Form Artifact */}
      {isArtifactMessage(message) && message.message.artifact_type === 'FORM' && (
        <div className="flex flex-col items-start">
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
            messageIndex={messageIndex}
            totalMessages={totalMessages}
            isAMessageBeingProcessed={isAMessageBeingProcessed}
          />
        </div>
      )}

      {/* Suggestions Section */}
      <div className="ml-auto">
        {/* Only show initial suggestions when no messages */}
        {totalMessages < 1 && (
          <SuggestionsArtifact
            suggestedQuestionOrientation="left"
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            handleSendUserMessage={handleSendUserMessage}
            artifact={{
              suggested_questions: initialSuggestedQuestions,
              suggested_questions_type: 'BUBBLE',
            }}
          />
        )}

        {/* Show suggestion artifacts - store handles filtering */}
        {isArtifactMessage(message) && message.message.artifact_type === 'SUGGESTIONS' && (
          <ChatArtifact
            artifact={{
              artifact_type: message.message.artifact_type,
              artifact_id: message.message.artifact_data.artifact_id,
              content: message.message.artifact_data.content as SuggestionArtifactContent,
              metadata: message.message.artifact_data.metadata,
              error: message.message.artifact_data.error,
              error_code: message.message.artifact_data.error_code,
            }}
            messageIndex={messageIndex}
            totalMessages={totalMessages}
            handleSendUserMessage={handleSendUserMessage}
            isAMessageBeingProcessed={isAMessageBeingProcessed}
          />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
