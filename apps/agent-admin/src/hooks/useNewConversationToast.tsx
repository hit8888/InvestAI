import { useEffect, useRef } from 'react';
import { ActiveConversation } from 'src/context/ActiveConversationsContext';
import toast, { ToastOptions } from 'react-hot-toast';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import NewLeadsToastIcon from '../components/ActiveConversationsComp/NewLeadsToastIcon';
import { useNotification } from './useNotification';

const TOAST_DURATION = 5000;

// Global toast tracking to prevent duplicates across component re-renders
export const globalToastTracker = {
  shownToasts: new Set<string>(),
  activeToastIds: new Set<string>(),
};

const getToastTitle = (companyName: string | undefined) => {
  if (!companyName) {
    return 'A new visitor matches your lead criteria.';
  }
  return `A new visitor from ${companyName} matches your lead criteria.`;
};

const showNewConversationToast = (
  conversation: ActiveConversation,
  handleJoinButtonInToast: (conversation: ActiveConversation) => void,
  notificationHook: ReturnType<typeof useNotification>,
) => {
  // Check global tracker first to prevent duplicates
  if (globalToastTracker.shownToasts.has(conversation.session_id)) {
    return;
  }

  const title = getToastTitle(conversation?.prospect?.company);

  const getToastContent = (toastId: string | undefined) => (
    <div className="success-toast-shadow flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2">
      <div className="flex flex-1 items-center gap-2">
        <NewLeadsToastIcon />
        <Typography variant="label-14-medium" textColor="default">
          New Potential Lead!
        </Typography>
        <Typography variant="body-14" textColor="gray500" className="max-w-xl flex-1">
          {title}
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          onClick={() => {
            handleJoinButtonInToast(conversation);
            toast.dismiss(toastId);
            // Remove from active toasts when dismissed
            globalToastTracker.activeToastIds.delete(conversation.session_id);
          }}
        >
          View Lead
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            toast.dismiss(toastId);
            // Remove from active toasts when dismissed
            globalToastTracker.activeToastIds.delete(conversation.session_id);
          }}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );

  // Mark as shown in global tracker before creating notification/toast
  globalToastTracker.shownToasts.add(conversation.session_id);
  globalToastTracker.activeToastIds.add(conversation.session_id);

  // Schedule cleanup for auto-dismissal to prevent memory leaks
  setTimeout(() => {
    globalToastTracker.activeToastIds.delete(conversation.session_id);
  }, TOAST_DURATION);

  // Only show browser notification when tab is not focused
  let notification = null;
  if (document.hidden) {
    const notificationOptions = {
      title: 'New Potential Lead!',
      body: title,
      icon: '/logo.svg',
      tag: `new-convo-${conversation.session_id}`,
      requireInteraction: false,
      silent: false,
      onClick: () => {
        handleJoinButtonInToast(conversation);
      },
    };

    notification = notificationHook.showNotification(notificationOptions);
  }

  // Show toast notification as fallback if browser notification failed or tab is focused
  if (!notification) {
    toast.custom((t: ToastOptions) => getToastContent(t.id), {
      id: `new-convo-${conversation.session_id}`,
      position: 'top-center',
      duration: TOAST_DURATION,
    });
  }
};

const useNewConversationToast = (
  currentTabConversations: ActiveConversation[] | null,
  handleJoinButtonInToast: (conversation: ActiveConversation) => void,
) => {
  // Track previous conversations to detect new ones
  const previousConversationsRef = useRef<Set<string>>(new Set());

  const notificationHook = useNotification();

  // Effect to detect new conversations and show toast only once per conversation
  useEffect(() => {
    if (!currentTabConversations || currentTabConversations.length === 0) {
      // Don't reset previous conversations when switching tabs or when conversations are empty
      // This prevents showing duplicate toasts when returning to a tab
      return;
    }

    const currentSessionIds = new Set(currentTabConversations.map((conv) => conv.session_id));
    const previousSessionIds = previousConversationsRef.current;

    // Find truly new conversations (not just re-ordered existing ones)
    const newSessionIds = Array.from(currentSessionIds).filter((sessionId) => !previousSessionIds.has(sessionId));

    // Show toast only for new conversations that haven't been shown before
    newSessionIds.forEach((sessionId) => {
      // Use global tracker to check if toast was already shown
      if (!globalToastTracker.shownToasts.has(sessionId)) {
        const conversation = currentTabConversations.find((conv) => conv.session_id === sessionId);
        if (conversation) {
          // Show notification/toast for the new conversation (global tracking handled inside showNewConversationToast)
          showNewConversationToast(conversation, handleJoinButtonInToast, notificationHook);
        }
      }
    });

    // Update previous conversations for next comparison
    previousConversationsRef.current = new Set(currentSessionIds);

    // Cleanup: Remove old session IDs from global tracker that are no longer in active conversations
    // to prevent memory leaks
    const allActiveSessionIds = new Set(currentSessionIds);
    globalToastTracker.shownToasts.forEach((sessionId) => {
      if (!allActiveSessionIds.has(sessionId)) {
        globalToastTracker.shownToasts.delete(sessionId);
        globalToastTracker.activeToastIds.delete(sessionId);
      }
    });
  }, [currentTabConversations, handleJoinButtonInToast, notificationHook]);
};

export default useNewConversationToast;
