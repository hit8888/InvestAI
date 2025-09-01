import { useCallback, useEffect, useRef } from 'react';
import { ActiveConversation } from 'src/context/ActiveConversationsContext';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import SuccessToastIcon from '@breakout/design-system/components/icons/success-toast-icon';
import Typography from '@breakout/design-system/components/Typography/index';

const useNewConversationToast = (
  currentTabConversations: ActiveConversation[] | null,
  handleCardClick: (conversation: ActiveConversation) => void,
) => {
  const getToastTitle = (companyName: string | undefined) => {
    if (!companyName) {
      return 'Someone is here';
    }
    return `Someone from ${companyName} is here`;
  };

  const showNewConversationToast = useCallback(
    (conversation: ActiveConversation) => {
      const title = getToastTitle(conversation?.prospect?.company);

      const getToastContent = () => (
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
                toast.dismiss();
              }}
            >
              Join
            </button>
            <button onClick={() => toast.dismiss()}>
              <X className="size-4" />
            </button>
          </div>
        </div>
      );

      toast.custom(getToastContent(), {
        position: 'top-right',
        duration: 60000,
      });
    },
    [handleCardClick],
  );

  // Track previous conversations to detect new ones
  const previousConversationsRef = useRef<Set<string>>(new Set());
  const shownToastSessionIds = useRef(new Set<string>());

  // Effect to detect new conversations and show toast only once per conversation
  useEffect(() => {
    if (!currentTabConversations || currentTabConversations.length === 0) {
      // Update previous conversations to empty set
      previousConversationsRef.current = new Set();
      return;
    }

    const currentSessionIds = new Set(currentTabConversations.map((conv) => conv.session_id));
    const previousSessionIds = previousConversationsRef.current;

    // Find truly new conversations (not just re-ordered existing ones)
    const newSessionIds = Array.from(currentSessionIds).filter((sessionId) => !previousSessionIds.has(sessionId));

    // Show toast only for new conversations that haven't been shown before
    newSessionIds.forEach((sessionId) => {
      if (!shownToastSessionIds.current.has(sessionId)) {
        const conversation = currentTabConversations.find((conv) => conv.session_id === sessionId);
        if (conversation) {
          // Mark this conversation as shown
          shownToastSessionIds.current.add(sessionId);
          // Show toast for the new conversation
          showNewConversationToast(conversation);
        }
      }
    });

    // Update previous conversations for next comparison
    previousConversationsRef.current = new Set(currentSessionIds);

    // Cleanup: Remove old session IDs that are no longer in active conversations
    // to prevent memory leaks
    shownToastSessionIds.current.forEach((sessionId) => {
      if (!currentSessionIds.has(sessionId)) {
        shownToastSessionIds.current.delete(sessionId);
      }
    });
  }, [currentTabConversations, showNewConversationToast]);
};

export default useNewConversationToast;
