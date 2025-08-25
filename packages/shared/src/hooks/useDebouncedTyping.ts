import { useCallback, useRef, useEffect } from 'react';

interface UseDebouncedTypingOptions {
  onTypingChange?: (isTyping: boolean) => void;
  onSendTypingEvent?: (isTyping: boolean) => void;
  typingStartDelay?: number;
  typingStopDelay?: number;
}

export const useDebouncedTyping = ({
  onTypingChange,
  onSendTypingEvent,
  typingStartDelay = 300,
  typingStopDelay = 500,
}: UseDebouncedTypingOptions = {}) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const startTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendTypingEvent = useCallback(
    (isTyping: boolean) => {
      if (isTypingRef.current === isTyping) return;

      isTypingRef.current = isTyping;
      onTypingChange?.(isTyping);
      onSendTypingEvent?.(isTyping);
    },
    [onTypingChange, onSendTypingEvent],
  );

  const debouncedTypingDetection = useCallback(() => {
    // Clear any existing start typing timeout
    if (startTypingTimeoutRef.current) {
      clearTimeout(startTypingTimeoutRef.current);
    }

    // Clear any existing stop typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If not currently typing, schedule a typing start event after typingStartDelay
    if (!isTypingRef.current) {
      startTypingTimeoutRef.current = setTimeout(() => {
        sendTypingEvent(true);
      }, typingStartDelay);
    }

    // Schedule typing stop event after typingStopDelay of no input
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingEvent(false);
    }, typingStopDelay);
  }, [sendTypingEvent, typingStartDelay, typingStopDelay]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTypingEvent(false);
  }, [sendTypingEvent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (startTypingTimeoutRef.current) {
        clearTimeout(startTypingTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Clear typing state when component unmounts
      if (isTypingRef.current) {
        sendTypingEvent(false);
      }
    };
  }, [sendTypingEvent]);

  return {
    debouncedTypingDetection,
    stopTyping,
  };
};
