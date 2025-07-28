import { cn } from '@breakout/design-system/lib/cn';
import React, { useMemo } from 'react';
import SuggestionsArtifact from '../ChatMessages/SuggestionsArtifact';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ViewType } from '@meaku/core/types/common';
import { checkIsCurrentMessageComplete, willMessageRenderHTML } from '@meaku/core/utils/messageUtils';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { useAgentMessagesScrolling } from '../../../hooks/useAgentMessagesScrolling';
import { IProps } from './types';
import DownArrowButton from './DownArrowButton';
import { shouldShowSuggestions } from './utils';
import MessageGroup from './MessageGroup';

const AgentMessages = ({
  viewType,
  messages,
  sessionId,
  orbState,
  showRightPanel = false,
  isAMessageBeingProcessed,
  hasFirstUserMessageBeenSent,
  setDemoPlayingStatus,
  setIsArtifactPlaying,
  setActiveArtifact,
  handleSendUserMessage,
  initialSuggestedQuestions,
  allowFullWidthForText,
  showDemoPreQuestions,
  primaryColor,
  logoURL,
  allowFeedback,
  feedbackData,
  lastMessageResponseId,
  orbLogoUrl,
  showOrbFromConfig,
  invertTextColor,
  enableScrollToBottom = true,
}: IProps) => {
  const isMobile = useIsMobile();

  // Use the custom scrolling hook
  const {
    currentMessageScrollToTop,
    parentContainerRef,
    lastGroupRef,
    groupStartScrollTargetRef,
    groupEndScrollTargetRef,
    agentMessagesContainerRef,
    containerHeight,
    showDownArrow,
    handleScrollToBottomOfContainer,
    lastGroupWithContentIndex,
    messagesSortedByResponseIdAndTimestamp,
  } = useAgentMessagesScrolling({
    messages,
    viewType,
    enableScrollToBottom,
  });

  // Memoized values
  const getInitialFeedback = useMemo(() => {
    return (message: WebSocketMessage) =>
      feedbackData?.find((feedback) => feedback.response_id === message.response_id);
  }, [feedbackData]);

  const aiMessages = messages.filter((message) => message.role === 'ai');
  const isCurrentMessageComplete = checkIsCurrentMessageComplete(messages, lastMessageResponseId);
  const isViewTypeAdmin = viewType === ViewType.ADMIN;

  // Container styles
  const containerStyle = {
    height: '100%',
    overflow: viewType === ViewType.USER ? 'hidden' : 'auto',
  } as const;

  const contentContainerClasses = cn([
    'mx-auto flex w-full flex-col gap-8',
    !showRightPanel && !allowFullWidthForText && 'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]',
  ]);

  return (
    <div
      ref={parentContainerRef}
      className={cn('w-full', isViewTypeAdmin && 'w-[50%]')}
      onWheel={(e) => e.stopPropagation()}
      style={containerStyle}
    >
      <div
        ref={agentMessagesContainerRef}
        className={cn(['relative h-full flex-1 space-y-4 overflow-y-auto p-2 pl-4 pr-2', isMobile && 'p-4'])}
      >
        <div className={contentContainerClasses}>
          {/* Message Groups */}
          {messagesSortedByResponseIdAndTimestamp.map((group, groupIndex) => {
            const isLastGroupWithContent = groupIndex === lastGroupWithContentIndex;
            const hasRenderableItems = group.some((message) => willMessageRenderHTML(message));

            return (
              <React.Fragment key={groupIndex}>
                <MessageGroup
                  group={group}
                  groupIndex={groupIndex}
                  isLastGroupWithContent={isLastGroupWithContent}
                  containerHeight={containerHeight}
                  enableScrollToBottom={enableScrollToBottom}
                  aiMessages={aiMessages}
                  hasFirstUserMessageBeenSent={hasFirstUserMessageBeenSent}
                  currentMessageScrollToTop={currentMessageScrollToTop}
                  lastGroupRef={lastGroupRef}
                  groupStartScrollTargetRef={groupStartScrollTargetRef}
                  groupEndScrollTargetRef={groupEndScrollTargetRef}
                  isCurrentMessageComplete={isCurrentMessageComplete}
                  showDemoPreQuestions={showDemoPreQuestions}
                  // Message props
                  isAMessageBeingProcessed={isAMessageBeingProcessed}
                  logoURL={logoURL}
                  viewType={viewType}
                  sessionId={sessionId}
                  primaryColor={primaryColor}
                  orbState={orbState}
                  setIsArtifactPlaying={setIsArtifactPlaying}
                  setActiveArtifact={setActiveArtifact}
                  setDemoPlayingStatus={setDemoPlayingStatus}
                  handleSendUserMessage={handleSendUserMessage}
                  allowFeedback={allowFeedback}
                  getInitialFeedback={getInitialFeedback}
                  lastMessageResponseId={lastMessageResponseId}
                  messages={messages}
                  orbLogoUrl={orbLogoUrl}
                  showOrbFromConfig={showOrbFromConfig}
                  invertTextColor={invertTextColor}
                />

                {/* Down Arrow Button - positioned after the last group */}
                {isLastGroupWithContent && hasRenderableItems && (
                  <DownArrowButton show={showDownArrow} onClick={handleScrollToBottomOfContainer} />
                )}
              </React.Fragment>
            );
          })}

          {/* Initial Suggestions */}
          {shouldShowSuggestions(aiMessages, hasFirstUserMessageBeenSent) && (
            <SuggestionsArtifact
              handleSendUserMessage={handleSendUserMessage}
              artifact={{
                suggested_questions: initialSuggestedQuestions,
                suggested_questions_type: 'BUBBLE',
              }}
              invertTextColor={invertTextColor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentMessages;
