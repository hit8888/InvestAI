import { MessageEventType, type Message as MessageType } from '../../../types/message';
import { Message } from './Message';
import { AvatarComponentProps, Typography } from '@meaku/saral';
import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { WaveLoader } from '../../../components/WaveLoader';
import { Sparkles, ChevronDown } from 'lucide-react';

interface MessagesProps {
  messages: MessageType[];
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;
  suggestedQuestions: string[];
  isStreaming: boolean;
  isLoading: boolean;
  getRenderableMessages: () => MessageType[];
  isDiscoveryQuestionShown: () => boolean;
  clearSuggestedQuestionsIfDiscoveryShown: () => void;
}

export const Messages = ({
  messages,
  sendUserMessage,
  selectedAvatar,
  suggestedQuestions,
  isStreaming,
  isLoading,
  getRenderableMessages,
  isDiscoveryQuestionShown,
  clearSuggestedQuestionsIfDiscoveryShown,
}: MessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // Clear suggested questions if discovery questions are shown
  React.useEffect(() => {
    clearSuggestedQuestionsIfDiscoveryShown();
  }, [clearSuggestedQuestionsIfDiscoveryShown]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [showDownArrow, setShowDownArrow] = useState<boolean>(false);

  // Get renderable messages (filtered to exclude artifacts during streaming)
  const renderableMessages = getRenderableMessages();

  // Messages are already processed and grouped by the store
  // Just render them in order
  const groupedMessages = useMemo(() => {
    // Group messages by response_id for rendering purposes
    const groupMap = new Map<string, MessageType[]>();

    renderableMessages.forEach((message) => {
      const responseId = message.response_id;
      if (!groupMap.has(responseId)) {
        groupMap.set(responseId, []);
      }
      groupMap.get(responseId)!.push(message);
    });

    // Convert to array and maintain the order from the store
    return Array.from(groupMap.values());
  }, [renderableMessages]);

  // Extract filled form artifact IDs from FORM_FILLED events
  const filledFormArtifactIds = useMemo(() => {
    return renderableMessages
      .filter(
        (message) =>
          message.event_type === MessageEventType.FORM_FILLED &&
          message.event_data &&
          'artifact_id' in message.event_data,
      )
      .map((message) => (message.event_data as { artifact_id: string }).artifact_id);
  }, [renderableMessages]);

  // Extract filled qualification artifact IDs from QUALIFICATION_FORM_FILLED events
  const filledQualificationArtifactIds = useMemo(() => {
    return renderableMessages
      .filter(
        (message) =>
          message.event_type === MessageEventType.QUALIFICATION_FORM_FILLED &&
          message.event_data &&
          'artifact_id' in message.event_data,
      )
      .map((message) => (message.event_data as { artifact_id: string }).artifact_id);
  }, [renderableMessages]);

  // Extract filled calendar URLs from CALENDAR_SUBMIT events
  const filledCalendarUrls = useMemo(() => {
    const calendarSubmitMessages = renderableMessages.filter(
      (message) =>
        message.event_type === MessageEventType.CALENDAR_SUBMIT &&
        message.event_data &&
        'calendar_url' in message.event_data,
    );

    return calendarSubmitMessages
      .map((message) => (message.event_data as { calendar_url: string }).calendar_url)
      .filter((url) => url && url !== ''); // Filter out empty strings
  }, [renderableMessages]);

  const getFilledData = (artifactId: string) => {
    const formfilledMessage = renderableMessages.find(
      (message) =>
        message.event_type === MessageEventType.FORM_FILLED && message.event_data?.artifact_id === artifactId,
    );
    return (formfilledMessage?.event_data as { form_data: Record<string, string> })?.form_data;
  };

  const getQualificationFilledData = (artifactId: string, responseId?: string) => {
    const qualificationFilledMessage = renderableMessages.find(
      (message) =>
        message.event_type === MessageEventType.QUALIFICATION_FORM_FILLED &&
        message.event_data?.artifact_id === artifactId &&
        (!responseId || message.response_id === responseId),
    );
    return (
      (qualificationFilledMessage?.event_data as { qualification_responses: Array<{ id: string; answer: string }> })
        ?.qualification_responses || []
    );
  };

  const isQualificationFilled = (artifactId: string, responseId?: string) => {
    return getQualificationFilledData(artifactId, responseId).length > 0;
  };

  // Calculate container height when messages change
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setContainerHeight(container.getBoundingClientRect().height - 32);
    }
  }, [renderableMessages.length]);

  // Calculate min-height for the last group
  const calculateMinHeight = (isLastGroup: boolean) => {
    if (!isLastGroup || containerHeight === 0) return undefined;
    return `${containerHeight}px`;
  };

  // Throttled scroll position checker
  const checkScrollPosition = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    // Show arrow if there's more content below (within 10px threshold)
    const hasMoreContent = scrollTop + clientHeight < scrollHeight - 10;
    setShowDownArrow(hasMoreContent);
  }, []);

  // Throttled version of checkScrollPosition
  const throttledCheckScrollPosition = useCallback(() => {
    let timeoutId: NodeJS.Timeout;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScrollPosition, 100); // Throttle to 100ms
    };
  }, [checkScrollPosition]);

  // Check scroll position to show/hide down arrow
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Initial check
    checkScrollPosition();

    // Add scroll event listener with throttling
    const throttledHandler = throttledCheckScrollPosition();
    scrollContainer.addEventListener('scroll', throttledHandler);

    return () => {
      scrollContainer.removeEventListener('scroll', throttledHandler);
    };
  }, [messages.length, checkScrollPosition, throttledCheckScrollPosition]);

  // Also check when grouped messages change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    setTimeout(checkScrollPosition, 100);
  }, [groupedMessages.length, checkScrollPosition]);

  // Scroll to the last group's first item aligned to top on mount when there are messages
  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current && scrollTargetRef.current) {
      // Add delay to account for container animation (300ms)
      setTimeout(() => {
        if (scrollContainerRef.current && scrollTargetRef.current) {
          scrollTargetRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 350); // Slightly more than 300ms to ensure animation is complete
    }
  }, []); // Only run on mount

  // Scroll to the last group's first item aligned to top when a new group is added
  useEffect(() => {
    if (scrollTargetRef.current && groupedMessages.length > 0) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [groupedMessages.length]);

  return (
    <div className="flex h-full flex-col" ref={containerRef}>
      <div className="h-full overflow-y-auto" ref={scrollContainerRef}>
        <div className="flex h-full flex-col gap-6 p-3">
          {groupedMessages.map((messageGroup, groupIndex) => {
            const isLastGroup = groupIndex === groupedMessages.length - 1;
            const shouldShowSuggestedQuestions =
              isLastGroup &&
              suggestedQuestions.length > 0 &&
              !isStreaming &&
              !isDiscoveryQuestionShown() &&
              (() => {
                // Don't show suggested questions if the last message is a calendar or form artifact
                const lastMessage = messages[messages.length - 1];
                const isLastMessageCalendarArtifact = lastMessage?.event_type === MessageEventType.CALENDAR_ARTIFACT;
                const isLastMessageFormArtifact =
                  lastMessage?.event_type === MessageEventType.FORM_ARTIFACT ||
                  lastMessage?.event_type === MessageEventType.FORM_FILLED;

                return !isLastMessageCalendarArtifact && !isLastMessageFormArtifact;
              })();

            return (
              <div
                key={`group-${groupIndex}`}
                className="flex flex-col gap-2"
                style={calculateMinHeight(isLastGroup) ? { minHeight: calculateMinHeight(isLastGroup) } : undefined}
              >
                {/* Scroll target marker at the start of the last group */}
                {isLastGroup && <div ref={scrollTargetRef} className="-my-2 h-0 w-0" aria-hidden="true" />}
                {messageGroup.map((message, messageIndex) => (
                  <Message
                    key={`${message.response_id}-${messageIndex}`}
                    message={message}
                    sendUserMessage={sendUserMessage}
                    filledFormArtifactIds={filledFormArtifactIds}
                    getFilledData={getFilledData}
                    filledQualificationArtifactIds={filledQualificationArtifactIds}
                    getQualificationFilledData={getQualificationFilledData}
                    isQualificationFilled={isQualificationFilled}
                    filledCalendarUrls={filledCalendarUrls}
                    selectedAvatar={selectedAvatar}
                  />
                ))}
                {shouldShowSuggestedQuestions && (
                  <div className="flex flex-col items-start gap-2">
                    <Typography variant="body-small" className="flex items-center gap-2 p-2.5 pl-0 text-primary">
                      <Sparkles className="size-4" />
                      Try Asking
                    </Typography>
                    {suggestedQuestions.map((question) => (
                      <div
                        key={question}
                        onClick={() =>
                          sendUserMessage?.(question, { event_type: MessageEventType.SUGGESTED_QUESTION_CLICKED })
                        }
                        className="inline-block max-w-full cursor-pointer rounded-xl bg-card px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        {question}
                      </div>
                    ))}
                  </div>
                )}
                {/* Show loader after the last message in the last group */}
                {isLastGroup && isLoading && (
                  <div className="ml-7 mr-auto flex min-h-11 max-w-[80%] items-center justify-start rounded-xl px-3">
                    <WaveLoader />
                  </div>
                )}
              </div>
            );
          })}
          {/* Show initial suggested questions when there are no messages */}
          {groupedMessages.length === 0 &&
            suggestedQuestions.length > 0 &&
            !isStreaming &&
            !isDiscoveryQuestionShown() && (
              <div
                className="flex flex-col gap-2"
                style={calculateMinHeight(true) ? { minHeight: calculateMinHeight(true) } : undefined}
              >
                <div className="flex flex-col items-start gap-2">
                  <Typography variant="body-small" className="flex items-center gap-2 p-2.5 pl-0 text-primary">
                    <Sparkles className="size-4" />
                    Try Asking
                  </Typography>
                  {suggestedQuestions.map((question) => (
                    <div
                      key={question}
                      onClick={() =>
                        sendUserMessage?.(question, { event_type: MessageEventType.SUGGESTED_QUESTION_CLICKED })
                      }
                      className="inline-block max-w-full cursor-pointer rounded-xl bg-card px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      {question}
                    </div>
                  ))}
                </div>
                {/* Scroll target marker for initial state */}
                <div ref={scrollTargetRef} className="h-0 w-0" aria-hidden="true" />
              </div>
            )}
          {/* Removed scroll bottom ref since we're not auto-scrolling */}
        </div>
      </div>

      {/* Down Arrow Button */}
      {showDownArrow && (
        <div className="absolute bottom-2 left-3 z-10">
          <button
            onClick={() => {
              scrollContainerRef.current?.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth',
              });
            }}
            className="flex size-6  animate-bounce items-center justify-center rounded-full bg-primary/80 text-background transition-colors hover:bg-primary"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
