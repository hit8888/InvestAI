import { MessageGroupProps } from './types';
import { shouldMessageScrollToTop, willMessageRenderHTML } from '@meaku/core/utils/messageUtils';
import { calculateMinHeight } from './utils';
import ScrollTarget from './ScrollTarget';
import MessageItem from '../ChatMessages/MessageItem';
import PreDemoQuestion from '../ChatMessages/PreDemoQuestion';

const MessageGroup = ({
  group,
  isLastGroupWithContent,
  containerHeight,
  enableScrollToBottom,
  aiMessages,
  hasFirstUserMessageBeenSent,
  currentMessageScrollToTop,
  lastGroupRef,
  groupStartScrollTargetRef,
  groupEndScrollTargetRef,
  isCurrentMessageComplete,
  showDemoPreQuestions,
  // Message props
  isAMessageBeingProcessed,
  logoURL,
  viewType,
  sessionId,
  primaryColor,
  orbState,
  setIsArtifactPlaying,
  setActiveArtifact,
  setDemoPlayingStatus,
  handleSendUserMessage,
  allowFeedback,
  getInitialFeedback,
  lastMessageResponseId,
  messages,
  orbLogoUrl,
  showOrbFromConfig,
  invertTextColor,
}: MessageGroupProps) => {
  // Check if there's at least one item in the group that will render HTML
  const hasRenderableItems = group.some((message) => willMessageRenderHTML(message));

  if (!hasRenderableItems) {
    return null;
  }

  const minHeight = calculateMinHeight(
    isLastGroupWithContent,
    aiMessages,
    hasFirstUserMessageBeenSent,
    containerHeight,
  );

  const shouldApplyMinHeight = hasRenderableItems && containerHeight > 0 && enableScrollToBottom;

  return (
    <div
      className="flex flex-col gap-8"
      style={shouldApplyMinHeight ? { minHeight } : undefined}
      ref={isLastGroupWithContent ? lastGroupRef : null}
    >
      {/* Start scroll target */}
      {isLastGroupWithContent && enableScrollToBottom && (
        <ScrollTarget refProp={groupStartScrollTargetRef} position="start" keyPrefix="last-group" />
      )}

      {/* Messages */}
      {group.map((message, idx) => (
        <MessageItem
          key={idx}
          elementRef={currentMessageScrollToTop}
          shouldMessageScrollToTop={shouldMessageScrollToTop(message)}
          isAMessageBeingProcessed={isAMessageBeingProcessed}
          logoURL={logoURL}
          viewType={viewType}
          sessionId={sessionId}
          primaryColor={primaryColor}
          message={message}
          orbState={orbState}
          setIsArtifactPlaying={setIsArtifactPlaying}
          setActiveArtifact={setActiveArtifact}
          setDemoPlayingStatus={setDemoPlayingStatus}
          handleSendUserMessage={handleSendUserMessage}
          allowFeedback={allowFeedback}
          initialFeedback={getInitialFeedback(message)}
          lastMessageResponseId={lastMessageResponseId}
          messages={messages}
          orbLogoUrl={orbLogoUrl}
          showOrbFromConfig={showOrbFromConfig}
          invertTextColor={invertTextColor}
        />
      ))}

      {/* Pre-demo questions */}
      {isLastGroupWithContent && isCurrentMessageComplete && showDemoPreQuestions && (
        <PreDemoQuestion
          isAMessageBeingProcessed={isAMessageBeingProcessed}
          setDemoPlayingStatus={setDemoPlayingStatus}
          handleSendUserMessage={handleSendUserMessage}
        />
      )}

      {/* End scroll target */}
      {isLastGroupWithContent && hasRenderableItems && enableScrollToBottom && (
        <ScrollTarget refProp={groupEndScrollTargetRef} position="end" keyPrefix="last-group" />
      )}
    </div>
  );
};

export default MessageGroup;
