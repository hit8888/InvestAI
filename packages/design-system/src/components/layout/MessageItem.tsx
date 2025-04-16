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
  isDiscoveryAnswer,
  isDiscoveryQuestion,
  // hasStreamMessageForForm,
  // isAIMessageRespondingToUserMessageWithNotMuchContext,
  isDisplayedAsTextMessage,
  isFormDataFilled,
} from '@meaku/core/utils/messageUtils';
import DiscoveryQuestion from './DiscoveryQuestion';
import { DiscoveryAnswer } from './DiscoveryAnswer/index.tsx';
import Orb from '../Orb';

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
  orbLogoUrl: string | undefined | null;
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
  orbLogoUrl,
}: IProps) => {
  // TODO: NEED TO REFACTOR THIS COMPONENT into Multiple Components - FOLLOW SINGLE RESPONSIBILITY PRINCIPLE
  const { isInView, ref: inViewRef } = useInView(0, true);
  const isAiMessage = message.role === 'ai';
  const isTextMessage = isDisplayedAsTextMessage(message);
  const isArtifactMessage = checkIsArtifactMessage(message);
  const isSalesResponseMessage = checkIsMainResponseMessage(message);

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === message.response_id);
  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const discoveryMessage = messagesWithSameResponseId.find((msg) => checkIsDiscoveryMessage(msg));

  const isDiscoveryMessage = !!discoveryMessage;

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
    (isSalesResponseMessage || isLoading || message.message_type === 'LOADING_TEXT');

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
    const formMetadata = isFormArtifact
      ? {
          is_filled:
            hasFormFilledMessage ||
            isFormDataFilled(
              (message.message.artifact_data.content as FormArtifactContent)?.form_fields,
              message.message.artifact_data.metadata.filled_data,
            ),
          filled_data: hasFormFilledMessage
            ? formFilledMessage.message.event_data.form_data
            : message.message.artifact_data.metadata?.filled_data,
        }
      : {};

    return (
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
        isformDisabled={isFormArtifact && formMetadata.is_filled}
      />
    );
  };

  const showingContentForAdmin = !usingForAgent && isAiMessage && isTextMessage;

  // TODO: Commented out for now as it is not being used. Will fix this the coming PR.
  // const isAIRespondingWithNotMuchContext = isAIMessageRespondingToUserMessageWithNotMuchContext(message);
  // const isStreamMessageForForm = formArtifactMessage ? hasStreamMessageForForm(message, formArtifactMessage) : false;

  //TODOS: NEED to callibrate the scrolling issue and latest question at the top issue.
  // For now it works for scroll issue, but not for latest question at the top issue.
  // Need to fix this based on number of words and how much space & parent width it would take in the chat widget.
  // const getMinHeight = () => {
  //   if (!isAiMessage || !isLastQuestionResponse || isDiscoveryMessage) return 'auto';
  //   return isAIRespondingWithNotMuchContext || isStreamMessageForForm
  //     ? 'calc(-800px + 100dvh)'
  //     : 'calc(-600px + 100dvh)';
  // };

  // To show the text message, the message must be a text message, the content must not be empty, and the message must be a discovery message or the sales response must be complete
  const shouldShowTextMessage =
    isTextMessage && message.message.content !== '' && (isDiscoveryMessage ? isSalesResponseComplete : true);

  // To show the feedback section, the message must be an AI message, the feedback must be allowed, and the message must be a text message
  const shouldShowFeedbackSection = isAiMessage && allowFeedback && isTextMessage;

  const hasSalesResponseCompleteAndIsArtifactMessage = isSalesResponseComplete && isArtifactMessage;
  // For Current Message - To show the form artifact, the sales response must be complete, the message must be an artifact message, and the artifact type must be a form
  const shouldShowFormArtifact =
    hasSalesResponseCompleteAndIsArtifactMessage && message.message.artifact_type === 'FORM';

  // For Current Message - To show the suggestions artifact, the sales response must be complete, the message must be an artifact message, and the artifact type must be suggestions
  const shouldShowSuggestions =
    hasSalesResponseCompleteAndIsArtifactMessage && message.message.artifact_type === 'SUGGESTIONS';

  // To show the suggestions artifact for admin, the suggestions artifact message must exist, and the message must not be a discovery message
  const shouldShowSuggestionsForAdmin = suggestionsArtifactMessage && !isDiscoveryMessage;

  const isLastMessage = message.response_id === messages[messages.length - 1].response_id;

  return (
    <MessageItemErrorBoundary messageId={message.response_id}>
      <div
        ref={inViewRef}
        // style={{ minHeight: getMinHeight() }}
      >
        {/* Text Message */}
        {shouldShowTextMessage && (
          <TextMessage
            message={message}
            isAiMessage={isAiMessage}
            usingForAgent={usingForAgent}
            isLastQuestionResponse={isLastQuestionResponse}
            orbState={orbState}
            primaryColor={primaryColor}
            shouldShowActiveOrb={shouldShowActiveOrb}
            orbLogoUrl={orbLogoUrl}
          />
        )}

        {isDiscoveryQuestion(message) && (
          <div className="my-5 flex flex-row items-end gap-4">
            {shouldShowActiveOrb && <Orb state={orbState} color={primaryColor} orbLogoUrl={orbLogoUrl} />}
            {!shouldShowActiveOrb && <div className="pl-7"></div>}
            <DiscoveryQuestion message={message} onSubmit={handleSendUserMessage} isLastMessage={isLastMessage} />
          </div>
        )}

        {isDiscoveryAnswer(message) && (
          <div className="my-5 flex flex-row items-end gap-4 pt-4">
            <div className="pl-7"></div>
            <DiscoveryAnswer message={message} />
          </div>
        )}

        {shouldShowFeedbackSection && (
          <div className="pl-11">
            <MessageDataSources usingForAgent={usingForAgent} dataSources={message.documents ?? []} />
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
            {isAnalyticsEvent && (
              <MessageAnalytics analytics={analyticsEvent.message.event_data as MessageAnalyticsEventData} />
            )}
          </div>
        )}

        {usingForAgent ? (
          <>
            {showMessageArtifactPreview ? <>{getMessageArtifactPreviewContent(message)}</> : null}

            {/* Form Artifact */}
            {shouldShowFormArtifact && (
              <div className="flex flex-col items-start py-4 pl-11">
                {getChatArtifactContent(message as WebSocketMessage & { message: ArtifactMessageContent }, true)}
              </div>
            )}

            {/* Show suggestion artifacts - store handles filtering */}
            {shouldShowSuggestions && (
              <div className="ml-auto mt-3">
                {getChatArtifactContent(message as WebSocketMessage & { message: ArtifactMessageContent })}
              </div>
            )}
          </>
        ) : null}

        {showingContentForAdmin ? (
          <>
            {shouldShowSuggestionsForAdmin && <>{getMessageArtifactPreviewContent(suggestionsArtifactMessage)}</>}

            {/* Form Artifact */}
            {hasFormArtifactMessage && (
              <div className="flex flex-col items-start py-4 pl-11">
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
