import { cn } from '@breakout/design-system/lib/cn';
import React, { useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import SuggestionsArtifact from './ChatMessages/SuggestionsArtifact';
import PreDemoQuestion from './ChatMessages/PreDemoQuestion';
import MessageItem from './ChatMessages/MessageItem';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus, MessageSenderRole, ViewType } from '@meaku/core/types/common';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import {
  checkIsCurrentMessageComplete,
  messagesGroupedByResponseIdAndTimestamp,
  shouldMessageScrollToTop,
  willMessageRenderHTML,
} from '@meaku/core/utils/messageUtils';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { ChevronsDown } from 'lucide-react';
import Button from '../Button';
import throttle from 'lodash/throttle';

interface IProps {
  viewType: ViewType;
  messages: WebSocketMessage[];
  sessionId: string;
  orbState: OrbStatusEnum;
  showRightPanel?: boolean;
  hasFirstUserMessageBeenSent?: boolean;
  isAMessageBeingProcessed: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  initialSuggestedQuestions: string[];
  allowFullWidthForText: boolean;
  showDemoPreQuestions: boolean;
  primaryColor: string | null;
  logoURL: string | null;
  allowFeedback: boolean;
  feedbackData?: FeedbackRequestPayload[];
  lastMessageResponseId: string;
  orbLogoUrl: string | undefined | null;
  showOrbFromConfig: boolean;
  invertTextColor: boolean;
  enableScrollToBottom?: boolean;
}

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
  const currentMessageScrollToTop = useRef<HTMLDivElement>(null);
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const lastGroupRef = useRef<HTMLDivElement>(null);
  const groupStartScrollTargetRef = useRef<HTMLDivElement>(null);
  const groupEndScrollTargetRef = useRef<HTMLDivElement>(null);
  const agentMessagesContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);
  const [showDownArrow, setShowDownArrow] = React.useState<boolean>(false);
  const handleScrollToBottom = () => {
    if (parentContainerRef.current) {
      const container = parentContainerRef.current;
      const lastUserMessage = currentMessageScrollToTop.current;

      if (lastUserMessage) {
        // Add a small delay to ensure content is rendered
        requestAnimationFrame(() => {
          // Get the offset of the last user message relative to the container
          const containerTop = container.offsetTop;
          const messageTop = lastUserMessage.offsetTop;
          // Scroll the container
          container.scrollTop = messageTop - containerTop;
        });
      }
    }
  };

  const handleScrollToBottomOfContainer = () => {
    groupEndScrollTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setShowDownArrow(false);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage?.role === MessageSenderRole.AI &&
      currentMessageScrollToTop.current &&
      (viewType === ViewType.ADMIN || viewType === ViewType.USER) &&
      enableScrollToBottom
    ) {
      handleScrollToBottom();
    }
  }, [viewType, messages, enableScrollToBottom]);

  const getInitialFeedback = useMemo(() => {
    return (message: WebSocketMessage) =>
      feedbackData?.find((feedback) => feedback.response_id === message.response_id);
  }, [feedbackData]);

  const aiMessages = messages.filter((message) => message.role === 'ai');

  const messagesSortedByResponseIdAndTimestamp = messagesGroupedByResponseIdAndTimestamp(messages);

  const isCurrentMessageComplete = checkIsCurrentMessageComplete(messages, lastMessageResponseId);
  const agentMessagesContainerClassName = useMemo(() => {
    if (isMobile || !showRightPanel) {
      return 'w-full shrink-0';
    } else if (!isMobile && showRightPanel) {
      return 'w-[35%] shrink-0';
    }
    return '';
  }, [isMobile, showRightPanel]);

  useLayoutEffect(() => {
    if (parentContainerRef.current && messagesSortedByResponseIdAndTimestamp.length > 0) {
      // Scroll to the scroll target div to ensure content above is visible
      setTimeout(() => {
        if (groupStartScrollTargetRef.current) {
          groupStartScrollTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [messagesSortedByResponseIdAndTimestamp.length]);

  useEffect(() => {
    if (parentContainerRef.current) {
      const container = parentContainerRef.current;
      setContainerHeight(container.getBoundingClientRect().height - 32);
    }
  }, [messagesSortedByResponseIdAndTimestamp.length]);

  // Check scroll position when messages change
  useLayoutEffect(() => {
    const container = parentContainerRef.current;
    if (!container) return;

    // Small delay to ensure DOM is updated
    const lastGroupParent = groupStartScrollTargetRef?.current?.parentElement;
    if (lastGroupParent) {
      const lastGroupHeight = lastGroupParent.offsetHeight;
      const containerHeight = container.offsetHeight;

      // Show arrow if the last group's parent has more content than the container
      const hasMoreContent = lastGroupHeight > containerHeight;
      setShowDownArrow(hasMoreContent);
    }
  }, [messages]);

  // Add scroll event listener to hide arrow when scrolled to end
  useEffect(() => {
    const scrollContainer = agentMessagesContainerRef?.current;
    if (!scrollContainer) return;

    const checkScrollPosition = throttle(() => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;

      // Check if we're at the bottom (within 10px threshold)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      // Hide arrow when scrolled to the end
      if (isAtBottom) {
        setShowDownArrow(false);
      }
    }, 200);

    // Initial check
    checkScrollPosition();

    // Add scroll event listener
    scrollContainer.addEventListener('scroll', checkScrollPosition);

    return () => {
      scrollContainer.removeEventListener('scroll', checkScrollPosition);
    };
  }, [messages.length]);

  // Find the last group with renderable items
  const lastGroupWithContentIndex = useMemo(() => {
    for (let i = messagesSortedByResponseIdAndTimestamp.length - 1; i >= 0; i--) {
      const group = messagesSortedByResponseIdAndTimestamp[i];
      if (group.some((message) => willMessageRenderHTML(message))) {
        return i;
      }
    }
    return -1;
  }, [messagesSortedByResponseIdAndTimestamp]);

  return (
    <div
      ref={parentContainerRef}
      className={cn(agentMessagesContainerClassName)}
      onWheel={(e) => e.stopPropagation()}
      style={{
        height: '100%',
        overflow: viewType === ViewType.USER ? 'hidden' : 'auto',
      }}
    >
      <div
        ref={agentMessagesContainerRef}
        className={cn(['relative h-full flex-1 space-y-4 overflow-y-auto p-2 pl-4 pr-2', isMobile && 'p-4'])}
      >
        <div
          className={cn([
            'mx-auto flex w-full flex-col gap-8',
            !showRightPanel && !allowFullWidthForText && 'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]',
          ])}
        >
          {/* Spacer to push content to bottom */}
          <div style={{ flex: 1, minHeight: 0 }} />

          {messagesSortedByResponseIdAndTimestamp.map((group, ind) => {
            const isLastGroupWithContent = ind === lastGroupWithContentIndex;

            // Check if there's at least one item in the group that will render HTML
            const hasRenderableItems = group.some((message) => willMessageRenderHTML(message));

            if (!hasRenderableItems) {
              return null;
            }

            return (
              <React.Fragment key={ind}>
                <div
                  className={cn(' flex flex-col gap-8')}
                  style={
                    hasRenderableItems && containerHeight > 0 && enableScrollToBottom
                      ? {
                          minHeight:
                            isLastGroupWithContent && (aiMessages.length > 1 || hasFirstUserMessageBeenSent)
                              ? `${containerHeight}px`
                              : undefined,
                        }
                      : undefined
                  }
                  ref={isLastGroupWithContent ? lastGroupRef : null}
                >
                  {/* Empty div for scrolling into view */}
                  {isLastGroupWithContent && enableScrollToBottom && (
                    <div
                      key="last-group-start"
                      ref={groupStartScrollTargetRef}
                      style={{ height: '1px', marginTop: -32 }}
                    />
                  )}
                  {group.map((message, idx) => {
                    return (
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
                        messages={group}
                        orbLogoUrl={orbLogoUrl}
                        showOrbFromConfig={showOrbFromConfig}
                        invertTextColor={invertTextColor}
                      />
                    );
                  })}
                  {isLastGroupWithContent && isCurrentMessageComplete && showDemoPreQuestions && (
                    <PreDemoQuestion
                      isAMessageBeingProcessed={isAMessageBeingProcessed}
                      setDemoPlayingStatus={setDemoPlayingStatus}
                      handleSendUserMessage={handleSendUserMessage}
                    />
                  )}

                  {/* End scroll target for initial mount */}
                  {isLastGroupWithContent && hasRenderableItems && enableScrollToBottom && (
                    <div
                      key="last-group-end"
                      ref={groupEndScrollTargetRef}
                      style={{ height: '1px', marginBottom: -32 }}
                    />
                  )}
                </div>
                {showDownArrow && isLastGroupWithContent && hasRenderableItems && (
                  <div className="sticky bottom-0 left-0 flex items-center justify-start">
                    <Button
                      variant="system_secondary"
                      buttonStyle="icon"
                      className="duration-[2000ms] size-7 animate-pulse rounded-full bg-white p-1"
                      onClick={handleScrollToBottomOfContainer}
                    >
                      <ChevronsDown />
                    </Button>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {aiMessages.length <= 1 && !hasFirstUserMessageBeenSent && (
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
