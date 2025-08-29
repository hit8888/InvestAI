import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { checkScrollPosition, scrollToBottom, scrollToElement } from '../utils/scrollUtils';

interface UseScrollManagementProps {
  groupedMessagesLength: number;
  hasActiveAdminSession: boolean;
  renderableMessagesLength: number;
  isAdminTyping: boolean;
  isStreaming: boolean;
}

export const useScrollManagement = ({
  groupedMessagesLength,
  hasActiveAdminSession,
  renderableMessagesLength,
  isAdminTyping,
  isStreaming,
}: UseScrollManagementProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageMarkerRef = useRef<HTMLDivElement>(null);
  const [showDownArrow, setShowDownArrow] = useState<boolean>(false);

  const handleScrollPosition = useCallback(() => {
    checkScrollPosition(scrollContainerRef.current, setShowDownArrow);
  }, []);

  // Optimized scroll handler for immediate response
  const handleScroll = useCallback(() => {
    checkScrollPosition(scrollContainerRef.current, setShowDownArrow);
  }, []);

  // Check scroll position when messages change
  useEffect(() => {
    setTimeout(handleScrollPosition, 100);
  }, [groupedMessagesLength, handleScrollPosition]);

  // Check scroll position when renderableMessages length changes to show/hide down arrow
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      handleScrollPosition();
    });
  }, [renderableMessagesLength, handleScrollPosition]);

  // Check scroll position immediately when content changes during streaming
  useLayoutEffect(() => {
    if (isStreaming) {
      // Immediate check when streaming is active and content changes
      handleScrollPosition();
    }
  }, [renderableMessagesLength, isStreaming, handleScrollPosition]);

  // Enhanced check for content changes during streaming to show down arrow immediately
  useLayoutEffect(() => {
    if (isStreaming && !hasActiveAdminSession) {
      // For streaming content in non-admin sessions, check if content goes out of bounds
      const checkContentBounds = () => {
        if (scrollContainerRef.current) {
          const scrollTop = scrollContainerRef.current.scrollTop;
          const scrollHeight = scrollContainerRef.current.scrollHeight;
          const clientHeight = scrollContainerRef.current.clientHeight;

          // Show down arrow if content extends beyond visible area
          const hasMoreContent = scrollTop + clientHeight < scrollHeight - 2;
          setShowDownArrow(hasMoreContent);
        }
      };

      // Check immediately and after a small delay to ensure DOM is updated
      checkContentBounds();
      setTimeout(checkContentBounds, 50);
    }
  }, [renderableMessagesLength, isStreaming, hasActiveAdminSession]);

  // Check scroll position when streaming state changes
  useLayoutEffect(() => {
    // Check immediately when streaming starts or stops
    handleScrollPosition();
  }, [isStreaming, handleScrollPosition]);

  // Auto-scroll to new last group when groups change (for non-admin sessions)
  useEffect(() => {
    if (groupedMessagesLength > 0 && scrollContainerRef.current && !hasActiveAdminSession) {
      // Small delay to ensure content is rendered and min-height is applied
      setTimeout(() => {
        // Show first item of last group at top of container (no auto-scroll to bottom)
        scrollToElement(scrollContainerRef.current, `[data-group-index="${groupedMessagesLength - 1}"]`, 'start');
      }, 200); // Slightly longer delay to allow min-height transition
    }
  }, [groupedMessagesLength, hasActiveAdminSession]);

  // Scroll to last message of admin session group when admin session starts or ends
  useEffect(() => {
    if (scrollContainerRef.current && hasActiveAdminSession) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        scrollToBottom(scrollContainerRef.current);
      }, 150);
    }
  }, [renderableMessagesLength, hasActiveAdminSession]); // Only auto-scroll for admin sessions

  // Scroll to last message marker during live admin session
  useEffect(() => {
    if (hasActiveAdminSession && lastMessageMarkerRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        lastMessageMarkerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 100);
    }
  }, [renderableMessagesLength, hasActiveAdminSession, isAdminTyping]);

  // Additional scroll to bottom for active admin sessions when messages change
  useEffect(() => {
    if (hasActiveAdminSession && scrollContainerRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        scrollToBottom(scrollContainerRef.current);
      }, 150);
    }
  }, [renderableMessagesLength, hasActiveAdminSession]);

  // Auto-scroll to last group when chat is opened or groups change
  useEffect(() => {
    if (groupedMessagesLength > 0 && scrollContainerRef.current) {
      // Small delay to ensure content is rendered and min-height is applied
      setTimeout(() => {
        if (hasActiveAdminSession) {
          // For active admin sessions, scroll to bottom to show last message
          scrollToBottom(scrollContainerRef.current);
        } else {
          // For regular sessions, show first item of last group at top of container
          scrollToElement(scrollContainerRef.current, `[data-group-index="${groupedMessagesLength - 1}"]`, 'start');
        }
      }, 200);
    }
  }, [groupedMessagesLength, hasActiveAdminSession]); // Run when groups change or admin session changes

  const scrollToBottomHandler = useCallback(() => {
    // Scroll to bottom and hide the down arrow
    scrollToBottom(scrollContainerRef.current);
    setShowDownArrow(false);
  }, []);

  return {
    scrollContainerRef,
    lastMessageMarkerRef,
    showDownArrow,
    handleScrollPosition,
    handleScroll,
    scrollToBottomHandler,
  };
};
