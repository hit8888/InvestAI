import { useEffect, useRef } from 'react';
import { ActiveConversation } from 'src/context/ActiveConversationsContext';
import toast, { ToastOptions } from 'react-hot-toast';
import { X } from 'lucide-react';
import SuccessToastIcon from '@breakout/design-system/components/icons/success-toast-icon';
import Typography from '@breakout/design-system/components/Typography/index';

const TOAST_DURATION = 60000;

// Global toast tracking to prevent duplicates across component re-renders
const globalToastTracker = {
  shownToasts: new Set<string>(),
  activeToastIds: new Set<string>(),
};

const getToastTitle = (companyName: string | undefined) => {
  if (!companyName) {
    return 'Someone is here';
  }
  return `Someone from ${companyName} is here`;
};

const showNewConversationToast = (
  conversation: ActiveConversation,
  handleCardClick: (conversation: ActiveConversation) => void,
) => {
  // Check global tracker first to prevent duplicates
  if (globalToastTracker.shownToasts.has(conversation.session_id)) {
    return;
  }

  const title = getToastTitle(conversation?.prospect?.company);

  const getToastContent = (toastId: string | undefined) => (
    <div className="success-toast-shadow flex w-full max-w-lg flex-1 items-center gap-2 rounded-lg border-2 border-gray-300 bg-gray-50 px-2.5 py-1">
      <div className="flex w-full items-center gap-2">
        <SuccessToastIcon width={'18'} height={'18'} className="text-positive-1000" />
        <Typography variant="label-14-medium" textColor="default">
          {title}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-sm text-primary"
          onClick={() => {
            handleCardClick(conversation);
            toast.dismiss(toastId);
            // Remove from active toasts when dismissed
            globalToastTracker.activeToastIds.delete(conversation.session_id);
          }}
        >
          Join
        </button>
        <button
          onClick={() => {
            toast.dismiss(toastId);
            // Remove from active toasts when dismissed
            globalToastTracker.activeToastIds.delete(conversation.session_id);
          }}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );

  // Mark as shown in global tracker before creating toast
  globalToastTracker.shownToasts.add(conversation.session_id);
  globalToastTracker.activeToastIds.add(conversation.session_id);

  // Schedule cleanup for auto-dismissal to prevent memory leaks
  setTimeout(() => {
    globalToastTracker.activeToastIds.delete(conversation.session_id);
  }, TOAST_DURATION);

  toast.custom((t: ToastOptions) => getToastContent(t.id), {
    id: `new-convo-${conversation.session_id}`,
    position: 'top-right',
    duration: TOAST_DURATION,
  });
};

const useNewConversationToast = (
  currentTabConversations: ActiveConversation[] | null,
  handleCardClick: (conversation: ActiveConversation) => void,
) => {
  // Track previous conversations to detect new ones
  const previousConversationsRef = useRef<Set<string>>(new Set());

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
          // Show toast for the new conversation (global tracking handled inside showNewConversationToast)
          showNewConversationToast(conversation, handleCardClick);
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
  }, [currentTabConversations, showNewConversationToast]);
};

export default useNewConversationToast;
