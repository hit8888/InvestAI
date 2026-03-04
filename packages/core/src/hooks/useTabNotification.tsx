import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { MessageSenderRole } from '../types';

type UseTabNotificationProps = {
  recentMessage: MessageEvent | null;
  interval?: number;
  maxContentLength?: number;
};

const MESSAGE_TYPE = 'TAB_NOTIFICATION';
const ACTION_SET_NOTIFICATION_TITLE = 'SET_NOTIFICATION_TITLE';
const ACTION_RESET_NOTIFICATION_TITLE = 'RESET_NOTIFICATION_TITLE';
const ACTION_PARENT_VISIBILITY_CHANGE = 'PARENT_VISIBILITY_CHANGE';
const MAX_CONTENT_LENGTH = 50;
const BLINK_INTERVAL = 2000;

const parseWebSocketMessage = (message: MessageEvent | null): WebSocketMessage | null => {
  if (!message?.data) return null;

  try {
    return JSON.parse(message.data) as WebSocketMessage;
  } catch (error) {
    console.warn('Failed to parse WebSocket message:', error);
    return null;
  }
};

const createNotificationTitle = (
  messageData: WebSocketMessage | null,
  senderFirstName: string,
  maxLength: number = MAX_CONTENT_LENGTH,
): string => {
  if (!messageData?.role || !messageData?.message?.content?.trim()) {
    return '';
  }

  const role =
    messageData.role === MessageSenderRole.AI
      ? ''
      : messageData.role?.charAt(0)?.toUpperCase() + messageData.role?.slice(1);
  const senderName = senderFirstName || role || 'Breakout';
  const content = messageData.message.content.trim();
  const truncatedContent = content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;

  return `${senderName}: "${truncatedContent}"`;
};

const isInIframe = window !== window.parent;

export default function useTabNotification({
  recentMessage,
  interval = BLINK_INTERVAL,
  maxContentLength = MAX_CONTENT_LENGTH,
}: UseTabNotificationProps) {
  const [shouldBlink, setShouldBlink] = useState(false);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTitleRef = useRef<string>(document.title);
  const currentNotificationTitleRef = useRef<string>('');
  const currentSenderFirstNameRef = useRef<string>('');
  const isHiddenRef = useRef<boolean>(false);

  const notificationTitle = useMemo(() => {
    if (!isHiddenRef.current) return '';

    const messageData = parseWebSocketMessage(recentMessage);

    if (messageData?.message_type === 'EVENT' && messageData?.message?.event_type === 'JOIN_SESSION') {
      currentSenderFirstNameRef.current = messageData?.message?.event_data?.first_name;
    }

    if (messageData?.message_type === 'EVENT' && messageData?.message?.event_type === 'LEAVE_SESSION') {
      currentSenderFirstNameRef.current = '';
    }

    return createNotificationTitle(messageData, currentSenderFirstNameRef.current, maxContentLength);
  }, [recentMessage, maxContentLength]);

  const setNotificationTitle = useCallback((title: string) => {
    if (isInIframe) {
      window.parent.postMessage(
        {
          type: MESSAGE_TYPE,
          action: ACTION_SET_NOTIFICATION_TITLE,
          title,
        },
        '*',
      );
    } else {
      document.title = title;
    }
  }, []);

  const resetNotificationTitle = useCallback(() => {
    if (isInIframe) {
      window.parent.postMessage(
        {
          type: MESSAGE_TYPE,
          action: ACTION_RESET_NOTIFICATION_TITLE,
        },
        '*',
      );
    } else {
      document.title = initialTitleRef.current;
    }
  }, []);

  const clearBlinkInterval = useCallback(() => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }
  }, []);

  const resetTitle = useCallback(() => {
    resetNotificationTitle();
    setShouldBlink(false);
    clearBlinkInterval();
  }, [clearBlinkInterval, resetNotificationTitle]);

  const startBlinking = useCallback((title: string) => {
    if (!title || currentNotificationTitleRef.current === title) return;

    currentNotificationTitleRef.current = title;
    setShouldBlink(true);
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (isHiddenRef.current && notificationTitle) {
      startBlinking(notificationTitle);
    } else {
      resetTitle();
    }
  }, [notificationTitle, startBlinking, resetTitle]);

  useEffect(() => {
    if (!isInIframe) return;

    const handleParentVisibilityMessage = (event: MessageEvent) => {
      if (event.data?.type === MESSAGE_TYPE && event.data?.action === ACTION_PARENT_VISIBILITY_CHANGE) {
        isHiddenRef.current = event.data.hidden;
        initialTitleRef.current = event.data.initialTitle;
        handleVisibilityChange();
      }
    };

    window.addEventListener('message', handleParentVisibilityMessage);
    return () => window.removeEventListener('message', handleParentVisibilityMessage);
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (isInIframe) return;

    const visibilityHandler = () => {
      isHiddenRef.current = document.hidden;
      handleVisibilityChange();
    };
    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (!shouldBlink || !currentNotificationTitleRef.current) {
      clearBlinkInterval();
      return;
    }

    let showNotification = true;

    blinkIntervalRef.current = setInterval(() => {
      const notificationToShow = showNotification ? currentNotificationTitleRef.current : initialTitleRef.current;
      setNotificationTitle(notificationToShow);
      showNotification = !showNotification;
    }, interval);

    return clearBlinkInterval;
  }, [shouldBlink, interval, clearBlinkInterval, setNotificationTitle]);

  useEffect(() => {
    if (notificationTitle && isHiddenRef.current) {
      startBlinking(notificationTitle);
    }
  }, [notificationTitle, startBlinking]);

  useEffect(() => {
    return () => {
      resetTitle();
    };
  }, [resetTitle]);
}
