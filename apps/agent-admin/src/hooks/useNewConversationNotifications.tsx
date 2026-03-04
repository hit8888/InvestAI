import { useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActiveConversation } from '../context/ActiveConversationsContext';
import useJoinConversationStore from '../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@neuraltrade/core/types/common';
import toast from 'react-hot-toast';
import NewConversationToast from '../components/ActiveConversationsComp/NewConversationToast';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import useAdminEventAnalytics from './useAdminEventAnalytics';

const TOAST_DURATION = 5000;

interface NotificationOptions {
  conversation: ActiveConversation;
  onViewLead: (conversation: ActiveConversation) => void;
}

export const showNewConversationNotification = ({ conversation, onViewLead }: NotificationOptions) => {
  const title = conversation?.prospect?.company
    ? `A new visitor from ${conversation.prospect.company} matches your lead criteria.`
    : 'A new visitor matches your lead criteria.';

  if (document.hidden) {
    showBrowserNotification(title, conversation, onViewLead);
  } else {
    showToastNotification(title, conversation, onViewLead);
  }
};

const showBrowserNotification = (
  title: string,
  conversation: ActiveConversation,
  onViewLead: (conversation: ActiveConversation) => void,
) => {
  if (!('Notification' in window)) return;

  const showNotification = () => {
    const notification = new Notification('New Potential Lead!', {
      body: title,
      icon: '/logo.svg',
      tag: `new-convo-${conversation.session_id}`,
    });

    notification.onclick = () => {
      onViewLead(conversation);
      notification.close();
      window.focus();
    };

    setTimeout(() => notification.close(), TOAST_DURATION);
  };

  if (Notification.permission === 'granted') {
    showNotification();
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') showNotification();
    });
  }
};

const showToastNotification = (
  title: string,
  conversation: ActiveConversation,
  onViewLead: (conversation: ActiveConversation) => void,
) => {
  toast.custom(
    <NewConversationToast
      toastId={`new-convo-${conversation.session_id}`}
      title={title}
      onViewLead={onViewLead}
      conversation={conversation}
    />,
    {
      id: `new-convo-${conversation.session_id}`,
      position: 'top-center',
      duration: TOAST_DURATION,
    },
  );
};

export const useNewConversationNotifications = () => {
  const { sessionID } = useParams<{ sessionID: string }>();
  const navigate = useNavigate();
  const { updateSessionStatus } = useJoinConversationStore();
  const { trackAdminEvent } = useAdminEventAnalytics();

  // Track conversations that have already been notified about
  const notifiedConversationsRef = useRef<Set<string>>(new Set());

  // Handle navigation to conversation when notification is clicked
  const handleViewLead = useCallback(
    (conversation: ActiveConversation) => {
      navigate(`/active-conversations/live/${conversation.session_id}`);
      updateSessionStatus(conversation.session_id, AdminConversationJoinStatus.PENDING);
    },
    [navigate, updateSessionStatus],
  );

  // Handle showing notification for new conversations
  const handleNewConversationNotification = useCallback(
    (newConversations: ActiveConversation[]) => {
      // Don't show notifications if currently viewing a conversation
      if (sessionID || newConversations.length === 0) return;

      // For multiple new conversations, show notification only for the latest one
      const latestConversation = newConversations.sort(
        (a, b) => new Date(b.last_message_timestamp).getTime() - new Date(a.last_message_timestamp).getTime(),
      )[0];

      showNewConversationNotification({
        conversation: latestConversation,
        onViewLead: handleViewLead,
      });
      trackAdminEvent(ANALYTICS_EVENT_NAMES.ADMIN_DASHBOARD.LIVE_CONVERSATION_NOTIFIED, {
        session_id: latestConversation.session_id,
      });

      // Mark this conversation as notified
      notifiedConversationsRef.current.add(latestConversation.session_id);
    },
    [sessionID, handleViewLead, trackAdminEvent],
  );

  // Clean up notified conversations that are no longer active
  const cleanupNotifiedConversations = useCallback((activeConversations: ActiveConversation[]) => {
    const activeSessionIds = activeConversations.map((c) => c.session_id);
    notifiedConversationsRef.current.forEach((sessionId) => {
      if (!activeSessionIds.includes(sessionId)) {
        notifiedConversationsRef.current.delete(sessionId);
      }
    });
  }, []);

  // Check if a conversation has already been notified about
  const isAlreadyNotified = useCallback((sessionId: string) => {
    return notifiedConversationsRef.current.has(sessionId);
  }, []);

  return {
    handleNewConversationNotification,
    cleanupNotifiedConversations,
    isAlreadyNotified,
  };
};
