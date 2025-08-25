import { useRef, useState, useEffect, useCallback } from 'react';
import { checkScrollPosition, scrollToBottom, scrollToElement } from '../utils/scrollUtils';

interface UseScrollManagementProps {
  groupedMessagesLength: number;
  hasActiveAdminSession: boolean;
  renderableMessagesLength: number;
  isAdminTyping: boolean;
}

export const useScrollManagement = ({
  groupedMessagesLength,
  hasActiveAdminSession,
  renderableMessagesLength,
  isAdminTyping,
}: UseScrollManagementProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageMarkerRef = useRef<HTMLDivElement>(null);
  const [showDownArrow, setShowDownArrow] = useState<boolean>(false);

  const handleScrollPosition = useCallback(() => {
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

  // Auto-scroll to new last group when groups change (for non-admin sessions)
  useEffect(() => {
    if (groupedMessagesLength > 0 && scrollContainerRef.current && !hasActiveAdminSession) {
      // Small delay to ensure content is rendered and min-height is applied
      setTimeout(() => {
        scrollToElement(scrollContainerRef.current, `[data-group-index="${groupedMessagesLength - 1}"]`, 'start');
      }, 200); // Slightly longer delay to allow min-height transition
    }
  }, [groupedMessagesLength, hasActiveAdminSession]);

  // Scroll to last message of admin session group when admin session starts or ends
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        scrollToBottom(scrollContainerRef.current);
      }, 150);
    }
  }, [renderableMessagesLength]); // Trigger when admin session starts or ends

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

  // Auto-scroll to last group when chat is opened
  useEffect(() => {
    if (groupedMessagesLength > 0 && scrollContainerRef.current) {
      // Small delay to ensure content is rendered and min-height is applied
      setTimeout(() => {
        if (hasActiveAdminSession) {
          // For active admin sessions, scroll to bottom to show last message
          scrollToBottom(scrollContainerRef.current);
        } else {
          // For regular sessions, scroll to first item of last group
          scrollToElement(scrollContainerRef.current, `[data-group-index="${groupedMessagesLength - 1}"]`, 'start');
        }
      }, 200);
    }
  }, []); // Only run on mount when chat is opened

  const scrollToBottomHandler = useCallback(() => {
    scrollToBottom(scrollContainerRef.current);
  }, []);

  return {
    scrollContainerRef,
    lastMessageMarkerRef,
    showDownArrow,
    handleScrollPosition,
    scrollToBottomHandler,
  };
};
