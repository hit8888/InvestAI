import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { MessageSenderRole, ViewType } from '@meaku/core/types/common';
import { willMessageRenderHTML, messagesGroupedByResponseIdAndTimestamp } from '@meaku/core/utils/messageUtils';
import throttle from 'lodash/throttle';

interface UseAgentMessagesScrollingProps {
  messages: WebSocketMessage[];
  viewType: ViewType;
  enableScrollToBottom: boolean;
}

interface UseAgentMessagesScrollingReturn {
  // Refs
  currentMessageScrollToTop: React.RefObject<HTMLDivElement | null>;
  parentContainerRef: React.RefObject<HTMLDivElement | null>;
  lastGroupRef: React.RefObject<HTMLDivElement | null>;
  groupStartScrollTargetRef: React.RefObject<HTMLDivElement | null>;
  groupEndScrollTargetRef: React.RefObject<HTMLDivElement | null>;
  agentMessagesContainerRef: React.RefObject<HTMLDivElement | null>;

  // State
  containerHeight: number;
  showDownArrow: boolean;

  // Handlers
  handleScrollToBottomOfContainer: () => void;

  // Computed values
  lastGroupWithContentIndex: number;
  messagesSortedByResponseIdAndTimestamp: WebSocketMessage[][];
}

export const useAgentMessagesScrolling = ({
  messages,
  viewType,
  enableScrollToBottom,
}: UseAgentMessagesScrollingProps): UseAgentMessagesScrollingReturn => {
  // Refs
  const currentMessageScrollToTop = useRef<HTMLDivElement>(null);
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const lastGroupRef = useRef<HTMLDivElement>(null);
  const groupStartScrollTargetRef = useRef<HTMLDivElement>(null);
  const groupEndScrollTargetRef = useRef<HTMLDivElement>(null);
  const agentMessagesContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [showDownArrow, setShowDownArrow] = useState<boolean>(false);

  // Computed values
  const messagesSortedByResponseIdAndTimestamp = messagesGroupedByResponseIdAndTimestamp(messages);

  const lastGroupWithContentIndex = useMemo(() => {
    for (let i = messagesSortedByResponseIdAndTimestamp.length - 1; i >= 0; i--) {
      const group = messagesSortedByResponseIdAndTimestamp[i];
      if (group.some((message) => willMessageRenderHTML(message))) {
        return i;
      }
    }
    return -1;
  }, [messagesSortedByResponseIdAndTimestamp]);

  // Handlers
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

  // Effects
  // Handle scrolling when new AI messages arrive
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

  // Scroll to scroll target on mount
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

  // Set container height when messages change
  useEffect(() => {
    if (parentContainerRef.current) {
      const container = parentContainerRef.current;
      setContainerHeight(container.getBoundingClientRect().height - 32);
    }
  }, [messagesSortedByResponseIdAndTimestamp.length]);

  // Check scroll position when messages change to show/hide down arrow
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

  return {
    // Refs
    currentMessageScrollToTop,
    parentContainerRef,
    lastGroupRef,
    groupStartScrollTargetRef,
    groupEndScrollTargetRef,
    agentMessagesContainerRef,

    // State
    containerHeight,
    showDownArrow,

    // Handlers
    handleScrollToBottomOfContainer,

    // Computed values
    lastGroupWithContentIndex,
    messagesSortedByResponseIdAndTimestamp,
  };
};
