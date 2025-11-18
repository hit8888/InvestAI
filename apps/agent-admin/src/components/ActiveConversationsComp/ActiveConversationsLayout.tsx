import { cn } from '@breakout/design-system/lib/cn';
import { ActiveConversation, ActiveConversationsContext } from '../../context/ActiveConversationsContext';
import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import ActiveConversationTabs from './ActiveConversationTabs';
import LiveConversationsHeader from './LiveConversationsHeader';
import { useTableWidth } from '@breakout/design-system/hooks/useTableWidth';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import JoinConversationDrawer from './JoinConversationDrawer';
import WebSocketManager from './WebSocketManager';
import { SendAdminMessageWithSessionIdFn, SendMessageFn } from '../../hooks/useAdminConversationWebSocket';
import { useSidebar } from '../../context/SidebarContext';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '../../stores/useSessionStore';
import { EventMessageContent } from '@meaku/core/types/webSocketData';
import NoActiveConversationsFound from './NoActiveConversationsFound';
import CustomPageHeader from '../CustomPageHeader';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import ActiveConversationsGridView from './ActiveConversationsGridView';
import ActiveConversationsGridViewShimmer from '../ShimmerComponent/ActiveConversationsGridViewShimmer';
import { useAdminSessionCleanup } from '../../hooks/useAdminSessionCleanup';

// Helper functions to create type-safe event messages
const createAdminResponseEvent = (content: string, eventData: Record<string, unknown> = {}): EventMessageContent => ({
  content,
  event_type: 'ADMIN_RESPONSE',
  event_data: {
    type: eventData.type as string | undefined,
    url: eventData.url as string | undefined,
    calendar_id: eventData.calendar_id as number | undefined,
  },
});

const createLeaveSessionEvent = (content: string, eventData: Record<string, unknown> = {}): EventMessageContent => ({
  content,
  event_type: 'LEAVE_SESSION',
  event_data: eventData,
});

const createJoinSessionEvent = (
  content: string,
  eventData: {
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    user_id: number;
  },
): EventMessageContent => ({
  content,
  event_type: 'JOIN_SESSION',
  event_data: {
    first_name: eventData.first_name,
    last_name: eventData.last_name,
    profile_picture: eventData.profile_picture,
    user_id: eventData.user_id,
  },
});

const createResponseSuggestionsEvent = (content: string, eventData: { query?: string }): EventMessageContent => ({
  content,
  event_type: 'RESPONSE_SUGGESTIONS',
  event_data: {
    query: eventData.query,
  },
});

const ActiveConversationsLayout = () => {
  const { isSidebarOpen } = useSidebar();
  const { widthStyle } = useTableWidth({ isSidebarOpen });
  const { activeConversations, isLoading } = useContext(ActiveConversationsContext);
  const [showActiveConversations, setShowActiveConversations] = useState(true);
  const [sendMessageFnMap, setSendMessageFnMap] = useState<Record<string, SendMessageFn>>({});
  const [pinnedSessionIds, setPinnedSessionIds] = useState<string[]>([]);
  const userInfo = useSessionStore((state) => state.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const {
    currentConversation,
    sessionsStatus,
    setCurrentConversation,
    updateSessionStatus,
    setIsGeneratingAIResponse,
  } = useJoinConversationStore();

  // Initialize admin session cleanup hook with comprehensive cleanup handling
  // This handles ALL scenarios where admin can leave without proper cleanup:
  // 1. Browser tab close/refresh (beforeunload event)
  // 2. Navigation away from session URL (popstate/route change)
  // 3. Component unmount (React cleanup)
  // 4. Explicit drawer close (user interaction)
  // 5. Explicit exit button (user interaction)
  const { handleExitConversation, handleCloseConversationDrawer } = useAdminSessionCleanup({
    currentConversation,
    sendMessageFnMap,
    updateSessionStatus,
    setCurrentConversation,
    createLeaveSessionEvent,
    sessionsStatus,
  });

  const pinnedConversations = useMemo(() => {
    if (!activeConversations) return [];
    return activeConversations.filter((conversation) => pinnedSessionIds.includes(conversation.session_id));
  }, [activeConversations, pinnedSessionIds]);

  const currentTabConversations = useMemo(() => {
    if (!activeConversations) return null;

    const normalizedPath = tenantName ? location.pathname.replace(`/${tenantName}`, '') : location.pathname;

    if (normalizedPath.includes('/assigned')) {
      return activeConversations.filter((conversation) => conversation.is_self_assigned);
    } else if (normalizedPath.includes('/pinned')) {
      return pinnedConversations;
    } else {
      return activeConversations;
    }
  }, [activeConversations, location.pathname, tenantName, pinnedConversations]);

  useEffect(() => {
    if (activeConversations?.length) {
      const storedPinnedIds = JSON.parse(localStorage.getItem('pinned_conversations') || '[]');
      const validPinnedIds = storedPinnedIds.filter((id: string) =>
        activeConversations.some((conv) => conv.session_id === id),
      );

      localStorage.setItem('pinned_conversations', JSON.stringify(validPinnedIds));
      setPinnedSessionIds(validPinnedIds);
    }
  }, [activeConversations]);

  const togglePinnedStatus = useCallback(
    (sessionId: string) => {
      const updatedPinnedIds = pinnedSessionIds.includes(sessionId)
        ? pinnedSessionIds.filter((id) => id !== sessionId)
        : [...pinnedSessionIds, sessionId];

      localStorage.setItem('pinned_conversations', JSON.stringify(updatedPinnedIds));
      setPinnedSessionIds(updatedPinnedIds);
    },
    [pinnedSessionIds],
  );

  useEffect(() => {
    if (currentConversation) {
      setShowActiveConversations(Boolean(currentConversation));
    }
  }, [currentConversation]);

  // Handle card click to navigate to the conversation
  const handleCardClick = useCallback(
    (conversation: ActiveConversation) => {
      navigate(`/active-conversations/live/${conversation.session_id}`);

      if (sessionsStatus[conversation.session_id] === AdminConversationJoinStatus.EXIT) {
        updateSessionStatus(conversation.session_id, AdminConversationJoinStatus.INIT);
      }
    },
    [navigate, sessionsStatus, updateSessionStatus],
  );

  const handleWebSocketChange = useCallback((sessionId: string, sendMessage: SendMessageFn) => {
    setSendMessageFnMap((sendMessageFnMap) => ({
      ...sendMessageFnMap,
      [sessionId]: sendMessage,
    }));
  }, []);

  const handleSendMessage: SendAdminMessageWithSessionIdFn = (sessionId, payload) => {
    const sendMessage = sendMessageFnMap[sessionId];

    if (!sendMessage) return;

    const eventType = payload.event_type ?? 'ADMIN_RESPONSE';
    const content = payload.content ?? '';
    const eventData = payload.event_data ?? {};

    let message: EventMessageContent;

    switch (eventType) {
      case 'ADMIN_RESPONSE':
        message = createAdminResponseEvent(content, eventData);
        break;
      case 'LEAVE_SESSION':
        message = createLeaveSessionEvent(content, eventData);
        break;
      case 'JOIN_SESSION':
        message = createJoinSessionEvent(
          content,
          eventData as {
            first_name: string;
            last_name: string;
            profile_picture: string | null;
            user_id: number;
          },
        );
        break;
      case 'RESPONSE_SUGGESTIONS':
        message = createResponseSuggestionsEvent(content, eventData as { query?: string });
        break;
      default:
        // For other event types, we'll use a generic approach
        // This maintains type safety while allowing for extensibility
        message = {
          content,
          event_type: eventType,
          event_data: eventData,
        } as EventMessageContent;
    }

    sendMessage({
      message,
      message_type: 'EVENT' as const,
    });
  };

  const handleWebSocketConnected = (sessionId: string) => {
    const sessionStatus = sessionsStatus[sessionId];

    if (sessionStatus === AdminConversationJoinStatus.JOINED) {
      return;
    }

    const sendMessage = sendMessageFnMap[sessionId];

    sendMessage({
      message: createJoinSessionEvent('', {
        first_name: userInfo?.first_name ?? '',
        last_name: userInfo?.last_name ?? '',
        profile_picture: userInfo?.profile_picture ?? '',
        user_id: userInfo?.id ?? '',
      }),
      message_type: 'EVENT',
    });

    updateSessionStatus(sessionId, AdminConversationJoinStatus.JOINED);
  };

  const handleAIResponseGenerationRequest = (sessionId: string, lastUserMessage: string) => {
    setIsGeneratingAIResponse(true);
    const sendMessage = sendMessageFnMap[sessionId];
    sendMessage({
      message: createResponseSuggestionsEvent('', {
        query: lastUserMessage ?? currentConversation?.last_user_message,
      }),
      message_type: 'EVENT',
    });
  };

  useEffect(() => {
    return () => {
      setCurrentConversation(null);
    };
  }, [setCurrentConversation]);

  return (
    <>
      <CustomPageHeader
        headerTitle={
          <span className="flex items-center gap-4">
            <span className="text-base font-semibold text-primary">Live Visitors</span>
            <LiveConversationsHeader isLoading={isLoading} totalActiveChats={currentTabConversations?.length ?? 0} />
          </span>
        }
        headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
      />
      <div className={cn('flex flex-col items-start gap-4 self-stretch rounded-2xl')} style={widthStyle}>
        <div className={cn('min-h-[80vh] w-full rounded-3xl', showActiveConversations ? 'block' : 'hidden')}>
          <ActiveConversationTabs hasPinnedConversations={pinnedConversations?.length > 0} />

          {currentTabConversations && currentTabConversations.length ? (
            <>
              <ActiveConversationsGridView
                conversations={currentTabConversations}
                onCardClick={handleCardClick}
                onTogglePinned={togglePinnedStatus}
                pinnedSessionIds={pinnedSessionIds}
              />

              {currentTabConversations.map((conversation) => (
                <WebSocketManager
                  key={conversation.session_id}
                  sessionId={conversation.session_id}
                  onWebSocketChange={handleWebSocketChange}
                  onConnected={handleWebSocketConnected}
                />
              ))}
            </>
          ) : isLoading ? (
            <ActiveConversationsGridViewShimmer />
          ) : (
            <NoActiveConversationsFound />
          )}

          {currentConversation ? (
            <JoinConversationDrawer
              conversation={currentConversation}
              onSendMessage={handleSendMessage}
              onExitConversation={handleExitConversation}
              onAIResponseGenerationRequest={handleAIResponseGenerationRequest}
              onClose={handleCloseConversationDrawer}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ActiveConversationsLayout;
