import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { AgentEventType, ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { SuggestionArtifactContent } from '@meaku/core/types/artifact';
import ArtifactsHistory from './ArtifactsHistory.tsx';
import TextMessage from './TextMessage';
import MessageItemErrorBoundary from './MessageItemErrorBoundary';
import {
  checkIsArtifactMessage,
  checkIsMainResponseMessage,
  checkIsLatestSalesResponseMessage,
  checkIsSalesResponseComplete,
  getFormArtifactMessage,
  getFormFilledEventByArtifactId,
  getMediaArtifactMessage,
  isDemoOptionsMessage,
  isDiscoveryQuestion,
  isDisplayedAsTextMessage,
  isMediaArtifact,
  checkIsAIMessage,
  isCtaEvent,
  checkIsLoadingTextMessage,
  isSuggestionArtifact,
  getMessagesWithSameResponseId,
} from '@meaku/core/utils/messageUtils';
import DiscoveryQuestion from './DiscoveryQuestion';
import { DiscoveryAnswer } from './DiscoveryAnswer/index.tsx';
import Orb from '../../Orb';
import SuggestionsArtifact from './SuggestionsArtifact';
import { ViewType } from '@meaku/core/types/common';
import AdminJoinedInfo from './AdminJoinedInfo.tsx';
import AdminExitInfo from './AdminExitInfo.tsx';
import DemoArtifactPreview from './DemoArtifactPreview.tsx';
import CtaEventMessage from './CtaEventMessage.tsx';
import MessageElementsDemoAgents from './MessageElementsDemoAgents.tsx';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import UserLeftInfo from './UserLeftInfo.tsx';

interface IProps {
  isAMessageBeingProcessed: boolean;
  viewType: ViewType;
  message: WebSocketMessage;
  messages: WebSocketMessage[];
  sessionId: string;
  primaryColor: string | null;
  orbState: OrbStatusEnum;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  allowFeedback: boolean;
  logoURL: string | null;
  initialFeedback?: FeedbackRequestPayload;
  lastMessageResponseId: string;
  orbLogoUrl: string | undefined | null;
  showOrbFromConfig: boolean;
  invertTextColor: boolean;
  elementRef: React.RefObject<HTMLDivElement | null>;
  shouldMessageScrollToTop: boolean;
}

const MessageItem = ({
  isAMessageBeingProcessed,
  viewType,
  message,
  messages,
  sessionId,
  primaryColor,
  orbState,
  setDemoPlayingStatus,
  setActiveArtifact,
  setIsArtifactPlaying,
  handleSendUserMessage,
  allowFeedback,
  logoURL,
  initialFeedback,
  lastMessageResponseId,
  orbLogoUrl,
  showOrbFromConfig,
  invertTextColor,
  elementRef,
  shouldMessageScrollToTop,
}: IProps) => {
  const isMobile = useIsMobile();
  // TODO: NEED TO REFACTOR THIS COMPONENT into Multiple Components - FOLLOW SINGLE RESPONSIBILITY PRINCIPLE
  const isAIMessage = checkIsAIMessage(message);
  const isTextMessage = isDisplayedAsTextMessage(message);
  const isArtifactMessage = checkIsArtifactMessage(message);
  const isSalesResponseMessage = checkIsMainResponseMessage(message);

  const messagesWithSameResponseId = getMessagesWithSameResponseId(messages, message.response_id);
  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const isLatestSalesResponseMessage = checkIsLatestSalesResponseMessage(messagesWithSameResponseId, message);

  const discoveryMessage = messagesWithSameResponseId.find((msg) => isDiscoveryQuestion(msg));
  const isDiscoveryMessage = !!discoveryMessage;
  const isCurrentDiscoveryMessage = isDiscoveryQuestion(message);

  const mediaArtifactMessage = getMediaArtifactMessage(messagesWithSameResponseId);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const qualifiedFormFilledMessage = getFormFilledEventByArtifactId(
    messages,
    formArtifactMessage,
    AgentEventType.QUALIFICATION_FORM_FILLED,
  );

  const isLastMessage = lastMessageResponseId === message.response_id;

  const isLastQuestionResponse = isLastMessage && isSalesResponseMessage;
  const isLoading = isAMessageBeingProcessed && isLastQuestionResponse;

  const isActiveMessage = isLatestSalesResponseMessage && !isDiscoveryMessage;
  const isDiscoveryActiveMessage = !isSalesResponseMessage && isDiscoveryMessage;
  const isMessageLoading = isLoading || checkIsLoadingTextMessage(message);
  const isCtaEventMessage = isCtaEvent(message, 'left');

  const shouldShowActiveOrb =
    isLastMessage &&
    (isActiveMessage || isMessageLoading || isDiscoveryActiveMessage || isCtaEventMessage) &&
    !isMobile;

  const showMessageArtifactPreview =
    isArtifactMessage &&
    (isMediaArtifact(message.message.artifact_type) || !!qualifiedFormFilledMessage) &&
    isSalesResponseComplete;

  const getMessageArtifactPreviewContent = (message: WebSocketMessage, showMessageArtifactPreview: boolean) => {
    if (!showMessageArtifactPreview) return null;
    return (
      <ArtifactsHistory
        message={message}
        messages={messages}
        viewType={viewType}
        handleSendUserMessage={handleSendUserMessage}
        setDemoPlayingStatus={setDemoPlayingStatus}
        setActiveArtifact={setActiveArtifact}
        logoURL={logoURL}
        setIsArtifactPlaying={setIsArtifactPlaying}
      />
    );
  };

  const showingContentForDashboard = viewType === ViewType.DASHBOARD && isAIMessage && isTextMessage;

  // To show the text message, the message must be a text message, the content must not be empty, and the message must be a discovery message or the sales response must be complete
  const shouldShowTextMessage =
    isTextMessage && message.message.content !== '' && (isDiscoveryMessage ? isSalesResponseComplete : true);

  // To show the feedback section, the message must be an AI message, the feedback must be allowed, and the message must be a text message
  const showMessageElementForDemoAgents = isAIMessage && allowFeedback && isTextMessage;

  const hasSalesResponseCompleteAndIsArtifactMessage = isSalesResponseComplete && isArtifactMessage;

  // For Current Message - To show the suggestions artifact, the sales response must be complete, the message must be an artifact message, and the artifact type must be suggestions
  const shouldShowSuggestions =
    isLastMessage && hasSalesResponseCompleteAndIsArtifactMessage && isSuggestionArtifact(message);

  // To show the media artifact for admin, the media artifact message must exist, and the current message must not be a discovery message
  const shouldShowMediaArtifactForAdmin =
    showingContentForDashboard && !!mediaArtifactMessage && !isCurrentDiscoveryMessage;

  const renderOrb = () => (
    <Orb showOrb={showOrbFromConfig} state={orbState} color={primaryColor} orbLogoUrl={orbLogoUrl} />
  );

  return (
    <MessageItemErrorBoundary message={message}>
      {/* Text Message */}
      {shouldShowTextMessage && (
        <TextMessage
          elementRef={elementRef}
          shouldMessageScrollToTop={shouldMessageScrollToTop}
          message={message}
          viewType={viewType}
          renderOrb={renderOrb}
          shouldShowActiveOrb={shouldShowActiveOrb}
          isLastQuestionResponse={isLastQuestionResponse}
        />
      )}

      <AdminJoinedInfo message={message} viewType={viewType} />
      <AdminExitInfo message={message} />
      <UserLeftInfo message={message} viewType={viewType} />

      {isCurrentDiscoveryMessage && (
        <DiscoveryQuestion
          viewType={viewType}
          message={message}
          onSubmit={handleSendUserMessage}
          isLastMessage={isLastMessage}
          renderOrb={renderOrb}
          shouldShowActiveOrb={shouldShowActiveOrb}
        />
      )}

      <DiscoveryAnswer message={message} viewType={viewType} />

      <MessageElementsDemoAgents
        message={message}
        viewType={viewType}
        sessionId={sessionId}
        initialFeedback={initialFeedback}
        invertTextColor={invertTextColor}
        messagesWithSameResponseId={messagesWithSameResponseId}
        showMessageElementForDemoAgents={showMessageElementForDemoAgents}
      />

      {viewType === ViewType.USER || viewType === ViewType.ADMIN ? (
        <>
          {getMessageArtifactPreviewContent(message, showMessageArtifactPreview)}

          <DemoArtifactPreview
            handleSendUserMessage={handleSendUserMessage}
            setDemoPlayingStatus={setDemoPlayingStatus}
            showDemoArtifactPreview={isDemoOptionsMessage(message)}
          />

          {/* Show suggestion artifacts - store handles filtering */}
          {shouldShowSuggestions && (
            <SuggestionsArtifact
              artifact={message.message.artifact_data.content as SuggestionArtifactContent}
              handleSendUserMessage={handleSendUserMessage}
              invertTextColor={invertTextColor}
              viewType={viewType}
            />
          )}
        </>
      ) : null}

      {!!mediaArtifactMessage &&
        getMessageArtifactPreviewContent(mediaArtifactMessage, shouldShowMediaArtifactForAdmin)}

      {isCtaEventMessage && <CtaEventMessage event={message} handleSendUserMessage={handleSendUserMessage} />}
    </MessageItemErrorBoundary>
  );
};

export default MessageItem;
