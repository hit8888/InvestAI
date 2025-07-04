import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { SuggestionArtifactContent } from '@meaku/core/types/artifact';
import MessageArtifactPreview from './MessageArtifactPreview';
import TextMessage from './TextMessage';
import MessageItemErrorBoundary from './MessageItemErrorBoundary';
import {
  checkIsArtifactMessage,
  checkIsMainResponseMessage,
  checkIsSalesResponseComplete,
  getFormArtifactMessage,
  getFormFilledEvent,
  getMediaArtifactMessage,
  isAIResponseInactiveMessage,
  isDemoOptionsMessage,
  isDiscoveryQuestion,
  isDisplayedAsTextMessage,
  isMediaArtifact,
  checkIsQualificationFormArtifact,
  checkIsAIMessage,
  isCtaEvent,
  checkIsLoadingTextMessage,
  isSuggestionArtifact,
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
  const isAIMessage = checkIsAIMessage(message);
  const isTextMessage = isDisplayedAsTextMessage(message);
  const isArtifactMessage = checkIsArtifactMessage(message);
  const isSalesResponseMessage = checkIsMainResponseMessage(message);

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === message.response_id);
  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const discoveryMessage = messagesWithSameResponseId.find((msg) => isDiscoveryQuestion(msg));
  const isDiscoveryMessage = !!discoveryMessage;
  const isCurrentDiscoveryMessage = isDiscoveryQuestion(message);

  const mediaArtifactMessage = getMediaArtifactMessage(messagesWithSameResponseId);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const qualifiedFormFilledMessage = getFormFilledEvent(messages, formArtifactMessage, 'QUALIFICATION_FORM_FILLED');

  const isLastMessage = lastMessageResponseId === message.response_id;

  const isLastQuestionResponse = isLastMessage && isSalesResponseMessage;
  const isLoading = isAMessageBeingProcessed && isLastQuestionResponse;

  const isCurrentMsgUserInactiveMessage = isAIResponseInactiveMessage(messagesWithSameResponseId, message);

  const isActiveMessage = isSalesResponseMessage && !isDiscoveryMessage;
  const isDiscoveryActiveMessage = !isSalesResponseMessage && isDiscoveryMessage;
  const isMessageLoading = isLoading || checkIsLoadingTextMessage(message);
  const isCtaEventMessage = isCtaEvent(message, 'left');

  const shouldShowActiveOrb =
    isLastMessage && (isActiveMessage || isMessageLoading || isDiscoveryActiveMessage || isCtaEventMessage);

  const showMessageArtifactPreview =
    isArtifactMessage &&
    ((isMediaArtifact(message.message.artifact_type) && !checkIsQualificationFormArtifact(message)) ||
      !!qualifiedFormFilledMessage) &&
    isSalesResponseComplete;

  const getMessageArtifactPreviewContent = (message: WebSocketMessage, showMessageArtifactPreview: boolean) => {
    if (!showMessageArtifactPreview) return null;
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
          message={message}
          viewType={viewType}
          renderOrb={renderOrb}
          shouldShowActiveOrb={shouldShowActiveOrb}
          isLastQuestionResponse={isLastQuestionResponse}
          isCurrentMsgUserInactiveMessage={isCurrentMsgUserInactiveMessage}
        />
      )}

      <AdminJoinedInfo message={message} viewType={viewType} />
      <AdminExitInfo message={message} />

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
