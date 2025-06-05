import useInView from '@meaku/core/hooks/useInView';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { getMessageTimestamp } from '@meaku/core/utils/index';
import { ArtifactBaseType, MessageAnalyticsEventData, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { SuggestionArtifactContent } from '@meaku/core/types/artifact';
import MessageArtifactPreview from './MessageArtifactPreview';
import TextMessage from './TextMessage';
import { useState } from 'react';
import MessageAnalytics from './MessageAnalytics';
import MessageDataSources from './MessageDataSources';
import MessageFeedback from './MessageFeedback';
import MessageItemErrorBoundary from './MessageItemErrorBoundary';
import {
  checkIsArtifactMessage,
  checkIsMainResponseMessage,
  checkIsSalesResponseComplete,
  getAnalyticsEvent,
  getFormArtifactMessage,
  getFormFilledEvent,
  getMediaArtifactMessage,
  isAIResponseInactiveMessage,
  isDemoOptionsMessage,
  isDiscoveryAnswer,
  isDiscoveryQuestion,
  isDisplayedAsTextMessage,
  isMediaArtifact,
  checkIsQualificationFormArtifact,
  checkIsAIMessage,
  checkIsAdminJoinedMessage,
  checkIsAdminLeftMessage,
} from '@meaku/core/utils/messageUtils';
import DiscoveryQuestion from './DiscoveryQuestion';
import { DiscoveryAnswer } from './DiscoveryAnswer/index.tsx';
import Orb from '../Orb';
import Typography from '../Typography/index.tsx';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import { ViewType } from '@meaku/core/types/common';
import AdminJoinedInfo from './AdminJoinedInfo.tsx';
import AdminExitInfo from './AdminExitInfo.tsx';
import DemoArtifactPreview from './DemoArtifactPreview.tsx';

interface IProps {
  isAMessageBeingProcessed: boolean;
  viewType: ViewType;
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
  showOrbFromConfig: boolean;
  invertTextColor: boolean;
}

const MessageItem = ({
  isAMessageBeingProcessed,
  viewType,
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
  showOrbFromConfig,
  invertTextColor,
}: IProps) => {
  // TODO: NEED TO REFACTOR THIS COMPONENT into Multiple Components - FOLLOW SINGLE RESPONSIBILITY PRINCIPLE
  const { isInView, ref: inViewRef } = useInView(0, true);
  const isAIMessage = checkIsAIMessage(message);
  const isTextMessage = isDisplayedAsTextMessage(message);
  const isArtifactMessage = checkIsArtifactMessage(message);
  const isSalesResponseMessage = checkIsMainResponseMessage(message);

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === message.response_id);
  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const discoveryMessage = messagesWithSameResponseId.find((msg) => isDiscoveryQuestion(msg));
  const isDiscoveryMessage = !!discoveryMessage;
  const isCurrentDiscoveryMessage = isDiscoveryQuestion(message);

  const analyticsEvent = getAnalyticsEvent(messagesWithSameResponseId);
  const isAnalyticsEvent = !!analyticsEvent;

  const mediaArtifactMessage = getMediaArtifactMessage(messagesWithSameResponseId);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const qualifiedFormFilledMessage = getFormFilledEvent(messages, formArtifactMessage, 'QUALIFICATION_FORM_FILLED');

  const isLastMessage = lastMessageResponseId === message.response_id;

  const isLastQuestionResponse = isLastMessage && isSalesResponseMessage;
  const isLoading = isAMessageBeingProcessed && isLastQuestionResponse;

  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const isCurrentMsgUserInactiveMessage = isAIResponseInactiveMessage(message);

  const isActiveMessage = isSalesResponseMessage && !isDiscoveryMessage;
  const isDiscoveryActiveMessage = !isSalesResponseMessage && isDiscoveryMessage;
  const isMessageLoading = isLoading || message.message_type === 'LOADING_TEXT';

  const shouldShowActiveOrb = isLastMessage && (isActiveMessage || isMessageLoading || isDiscoveryActiveMessage);

  const showArtifactPreview = messageIndex >= totalMessages - 4;

  const showMessageArtifactPreview =
    isArtifactMessage &&
    ((isMediaArtifact(message.message.artifact_type) && !checkIsQualificationFormArtifact(message)) ||
      !!qualifiedFormFilledMessage) &&
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
        messages={messages}
        viewType={viewType}
        setDemoPlayingStatus={setDemoPlayingStatus}
        setActiveArtifact={setActiveArtifact}
        logoURL={logoURL}
      />
    );
  };

  const showingContentForDashboard = viewType === ViewType.DASHBOARD && isAIMessage && isTextMessage;

  // To show the text message, the message must be a text message, the content must not be empty, and the message must be a discovery message or the sales response must be complete
  const shouldShowTextMessage =
    isTextMessage && message.message.content !== '' && (isDiscoveryMessage ? isSalesResponseComplete : true);

  // To show the feedback section, the message must be an AI message, the feedback must be allowed, and the message must be a text message
  const shouldShowFeedbackSection = isAIMessage && allowFeedback && isTextMessage;

  const hasSalesResponseCompleteAndIsArtifactMessage = isSalesResponseComplete && isArtifactMessage;

  // For Current Message - To show the suggestions artifact, the sales response must be complete, the message must be an artifact message, and the artifact type must be suggestions
  const shouldShowSuggestions =
    isLastMessage && hasSalesResponseCompleteAndIsArtifactMessage && message.message.artifact_type === 'SUGGESTIONS';

  // To show the media artifact for admin, the media artifact message must exist, and the current message must not be a discovery message
  const shouldShowMediaArtifactForAdmin = mediaArtifactMessage && !isCurrentDiscoveryMessage;

  return (
    <MessageItemErrorBoundary message={message}>
      <div ref={inViewRef}>
        {/* Text Message */}
        {shouldShowTextMessage && (
          <TextMessage
            message={message}
            viewType={viewType}
            isCurrentMsgUserInactiveMessage={isCurrentMsgUserInactiveMessage}
            isLastQuestionResponse={isLastQuestionResponse}
            orbState={orbState}
            primaryColor={primaryColor}
            shouldShowActiveOrb={shouldShowActiveOrb}
            orbLogoUrl={orbLogoUrl}
            showOrbFromConfig={showOrbFromConfig}
          />
        )}

        {checkIsAdminJoinedMessage(message) && (viewType === ViewType.USER || viewType === ViewType.DASHBOARD) && (
          <AdminJoinedInfo />
        )}

        {checkIsAdminLeftMessage(message) && (viewType === ViewType.USER || viewType === ViewType.DASHBOARD) && (
          <AdminExitInfo />
        )}

        {isDiscoveryQuestion(message) && (
          <div className="my-5 flex w-full items-start justify-start gap-4">
            {shouldShowActiveOrb && (
              <Orb showOrb={showOrbFromConfig} state={orbState} color={primaryColor} orbLogoUrl={orbLogoUrl} />
            )}
            {!shouldShowActiveOrb && <div className="pl-7"></div>}
            <DiscoveryQuestion
              viewType={viewType}
              message={message}
              onSubmit={handleSendUserMessage}
              isLastMessage={isLastMessage}
            />
          </div>
        )}

        {isDiscoveryAnswer(message) && (
          <div className="my-5 flex flex-row items-end gap-4">
            {viewType === ViewType.USER ? <div className="pl-7"></div> : null}
            <DiscoveryAnswer message={message} viewType={viewType} />
          </div>
        )}

        {shouldShowFeedbackSection && (
          <div className="pl-11">
            <MessageDataSources viewType={viewType} dataSources={message.documents ?? []} />
            {viewType !== ViewType.USER && (
              <Typography className="mt-2 w-full" variant="caption-12-medium" textColor="gray400">
                {formattedTimestamp}
              </Typography>
            )}
            {isSalesResponseComplete && (
              <MessageFeedback
                sessionId={sessionId}
                viewType={viewType}
                message={message}
                feedback={feedback}
                onAddFeedback={handleAddFeedback}
                onRemoveFeedback={handleRemoveFeedback}
                invertTextColor={invertTextColor}
              />
            )}
            {isAnalyticsEvent && (
              <MessageAnalytics
                viewType={viewType}
                invertTextColor={invertTextColor}
                analytics={analyticsEvent.message.event_data as MessageAnalyticsEventData}
              />
            )}
          </div>
        )}

        {viewType === ViewType.USER || viewType === ViewType.ADMIN ? (
          <>
            {showMessageArtifactPreview ? <>{getMessageArtifactPreviewContent(message)}</> : null}

            {isDemoOptionsMessage(message) ? (
              <DemoArtifactPreview
                handleSendUserMessage={handleSendUserMessage}
                setDemoPlayingStatus={setDemoPlayingStatus}
              />
            ) : null}

            {/* Show suggestion artifacts - store handles filtering */}
            {shouldShowSuggestions && (
              <div className="ml-auto mt-3">
                <SuggestionsArtifact
                  suggestedQuestionOrientation="right"
                  artifact={message.message.artifact_data.content as SuggestionArtifactContent}
                  handleSendUserMessage={handleSendUserMessage}
                  invertTextColor={invertTextColor}
                  viewType={viewType}
                />
              </div>
            )}
          </>
        ) : null}

        {showingContentForDashboard ? (
          <>{shouldShowMediaArtifactForAdmin && <>{getMessageArtifactPreviewContent(mediaArtifactMessage)}</>}</>
        ) : null}
      </div>
    </MessageItemErrorBoundary>
  );
};

export default MessageItem;
