import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import { ActiveConversation } from '../context/ActiveConversationsContext';
import { SendMessageFn } from './useAdminConversationWebSocket';
import { EventMessageContent } from '@meaku/core/types/webSocketData';

interface UseAdminSessionCleanupProps {
  currentConversation: ActiveConversation | null;
  sendMessageFnMap: Record<string, SendMessageFn>;
  updateSessionStatus: (sessionId: string, status: AdminConversationJoinStatus) => void;
  setCurrentConversation: (conversation: ActiveConversation | null) => void;
  createLeaveSessionEvent: (content: string, eventData?: Record<string, unknown>) => EventMessageContent;
  sessionsStatus: Record<string, AdminConversationJoinStatus>;
}

/**
 * Custom hook to handle all scenarios where admin needs to leave a conversation session
 * and ensure proper LEAVE_SESSION event is sent to prevent agent-side inconsistencies.
 *
 * IMPORTANT: Only sends LEAVE_SESSION events if the admin has actually joined the conversation
 * (AdminConversationJoinStatus.JOINED). This prevents unnecessary leave events when admin
 * is only viewing conversations without joining them.
 *
 * Handles the following scenarios:
 * 1. Browser tab close/refresh (beforeunload event)
 * 2. Page navigation away from session
 * 3. Component unmount cleanup
 * 4. Explicit cleanup calls
 */
export const useAdminSessionCleanup = ({
  currentConversation,
  sendMessageFnMap,
  updateSessionStatus,
  setCurrentConversation,
  createLeaveSessionEvent,
  sessionsStatus,
}: UseAdminSessionCleanupProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use refs to ensure we always have latest values in event handlers
  const currentConversationRef = useRef(currentConversation);
  const sendMessageFnMapRef = useRef(sendMessageFnMap);
  const sessionsStatusRef = useRef(sessionsStatus);

  // Update refs when props change
  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  useEffect(() => {
    sendMessageFnMapRef.current = sendMessageFnMap;
  }, [sendMessageFnMap]);

  useEffect(() => {
    sessionsStatusRef.current = sessionsStatus;
  }, [sessionsStatus]);

  /**
   * Core cleanup function that sends LEAVE_SESSION event and updates local state
   * This is the single source of truth for session cleanup logic
   */
  const performSessionCleanup = useCallback(
    (sessionId: string) => {
      try {
        const sendMessage = sendMessageFnMapRef.current[sessionId];

        if (sendMessage) {
          // Send LEAVE_SESSION event to notify agent that admin has left
          sendMessage({
            message: createLeaveSessionEvent('', {}),
            message_type: 'EVENT',
          });

          // Update local session status
          updateSessionStatus(sessionId, AdminConversationJoinStatus.EXIT);
        } else {
          console.warn(`[Admin Session Cleanup] No sendMessage function available for session ${sessionId}`);
        }
      } catch (error) {
        console.error(`[Admin Session Cleanup] Error during cleanup for session ${sessionId}:`, error);
      }
    },
    [createLeaveSessionEvent, updateSessionStatus],
  );

  /**
   * Cleanup current conversation if one exists and admin has joined
   */
  const cleanupCurrentConversation = useCallback(() => {
    const conversation = currentConversationRef.current;
    if (conversation?.session_id) {
      const sessionStatus = sessionsStatusRef.current[conversation.session_id];

      // Only send LEAVE_SESSION event if admin has actually joined the conversation
      if (sessionStatus === AdminConversationJoinStatus.JOINED) {
        performSessionCleanup(conversation.session_id);
      }
    }
  }, [performSessionCleanup]);

  /**
   * Handle explicit exit (when user clicks exit button)
   */
  const handleExitConversation = useCallback(() => {
    const conversation = currentConversationRef.current;
    if (conversation?.session_id) {
      const sessionStatus = sessionsStatusRef.current[conversation.session_id];

      // Only send LEAVE_SESSION event if admin has actually joined the conversation
      if (sessionStatus === AdminConversationJoinStatus.JOINED) {
        performSessionCleanup(conversation.session_id);
      }

      setCurrentConversation(null);
      navigate('/active-conversations');
    }
  }, [performSessionCleanup, setCurrentConversation, navigate]);

  /**
   * Handle drawer/modal close (when user closes conversation drawer)
   */
  const handleCloseConversationDrawer = useCallback(() => {
    // Always cleanup current conversation when drawer is closed
    cleanupCurrentConversation();
    setCurrentConversation(null);
    navigate('/active-conversations');
  }, [cleanupCurrentConversation, setCurrentConversation, navigate]);

  /**
   * Browser beforeunload event handler for tab close/refresh scenarios
   * Only sends LEAVE_SESSION event if admin has actually joined the conversation
   */
  const handleBeforeUnload = useCallback(
    (_event: BeforeUnloadEvent) => {
      cleanupCurrentConversation();

      // Note: We don't prevent the unload as that would be poor UX
      // The cleanup should happen synchronously before the page unloads
    },
    [cleanupCurrentConversation],
  );

  /**
   * Handle URL/route changes that navigate away from conversation
   */
  const handleRouteChange = useCallback(() => {
    const conversation = currentConversationRef.current;
    if (!conversation) return;

    // Check if we're navigating away from the current session
    const currentSessionId = conversation.session_id;
    const isStillOnSessionPage = location.pathname.includes(`/live/${currentSessionId}`);

    if (!isStillOnSessionPage) {
      cleanupCurrentConversation();
      setCurrentConversation(null);
    }
  }, [location.pathname, cleanupCurrentConversation, setCurrentConversation]);

  // Set up browser event listeners
  useEffect(() => {
    // Handle browser tab close/refresh
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Handle browser back/forward navigation
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [handleBeforeUnload, handleRouteChange]);

  // Handle route changes (React Router navigation)
  useEffect(() => {
    handleRouteChange();
  }, [handleRouteChange]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupCurrentConversation();
    };
  }, [cleanupCurrentConversation]);

  // Monitor websocket connection status and cleanup if connection is lost
  // while admin is in a conversation (helps with network disconnection scenarios)
  useEffect(() => {
    if (!currentConversation) return;

    const sessionId = currentConversation.session_id;
    const sendMessage = sendMessageFnMapRef.current[sessionId];

    // If we have a conversation but no sendMessage function, it might indicate
    // websocket disconnection - this is an additional safety net
    if (!sendMessage) {
      console.warn(`[Admin Session Cleanup] No websocket connection for active session ${sessionId}, ensuring cleanup`);
      updateSessionStatus(sessionId, AdminConversationJoinStatus.EXIT);
    }
  }, [currentConversation, sendMessageFnMap, updateSessionStatus]);

  return {
    handleExitConversation,
    handleCloseConversationDrawer,
    cleanupCurrentConversation,
    performSessionCleanup,
  };
};
