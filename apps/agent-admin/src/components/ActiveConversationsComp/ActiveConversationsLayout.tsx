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
import { useAuth } from '../../context/AuthProvider';
import NoActiveConversationsFound from './NoActiveConversationsFound';
import CustomPageHeader from '../CustomPageHeader';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import ActiveConversationsGridView from './ActiveConversationsGridView';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import ActiveConversationsGridViewShimmer from '../ShimmerComponent/ActiveConversationsGridViewShimmer';

const ActiveConversationsLayout = () => {
  const { isSidebarOpen } = useSidebar();
  const { widthStyle } = useTableWidth({ isSidebarOpen });
  const { activeConversations, isLoading } = useContext(ActiveConversationsContext);
  const [showActiveConversations, setShowActiveConversations] = useState(true);
  const [sendMessageFnMap, setSendMessageFnMap] = useState<Record<string, SendMessageFn>>({});
  const [pinnedSessionIds, setPinnedSessionIds] = useState<string[]>([]);
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = getTenantFromLocalStorage();

  const {
    currentConversation,
    sessionsStatus,
    setCurrentConversation,
    updateSessionStatus,
    setIsGeneratingAIResponse,
  } = useJoinConversationStore();

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

  const handleExitConversation = () => {
    const sessionId = currentConversation?.session_id;

    if (sessionId) {
      const sendMessage = sendMessageFnMap[sessionId];

      sendMessage({
        message: {
          content: '',
          event_type: 'LEAVE_SESSION',
          event_data: {},
        },
        message_type: 'EVENT',
      });

      updateSessionStatus(sessionId, AdminConversationJoinStatus.EXIT);
      setCurrentConversation(null);
      navigate('/active-conversations');
    }
  };

  const handleCardClick = (conversation: ActiveConversation) => {
    navigate(`/active-conversations/live/${conversation.session_id}`);

    if (sessionsStatus[conversation.session_id] === AdminConversationJoinStatus.EXIT) {
      updateSessionStatus(conversation.session_id, AdminConversationJoinStatus.INIT);
    }
  };

  const handleCloseJoinConversationDrawer = () => {
    setCurrentConversation(null);
    navigate('/active-conversations');
  };

  const handleWebSocketChange = useCallback((sessionId: string, sendMessage: SendMessageFn) => {
    setSendMessageFnMap((sendMessageFnMap) => ({
      ...sendMessageFnMap,
      [sessionId]: sendMessage,
    }));
  }, []);

  const handleSendMessage: SendAdminMessageWithSessionIdFn = (sessionId, payload) => {
    const sendMessage = sendMessageFnMap[sessionId];

    sendMessage?.({
      message: {
        event_type: 'ADMIN_RESPONSE',
        content: payload.content ?? '',
        event_data: {
          ...(payload?.event_data ?? {}),
        },
      },
      message_type: 'EVENT',
    });
  };

  const handleWebSocketConnected = (sessionId: string) => {
    const sessionStatus = sessionsStatus[sessionId];

    if (sessionStatus === AdminConversationJoinStatus.JOINED) {
      return;
    }

    const sendMessage = sendMessageFnMap[sessionId];

    sendMessage({
      message: {
        content: '',
        event_type: 'JOIN_SESSION',
        event_data: {
          first_name: userInfo?.first_name ?? '',
          last_name: userInfo?.last_name ?? '',
          profile_picture: userInfo?.profile_picture ?? '',
        },
      },
      message_type: 'EVENT',
    });

    updateSessionStatus(sessionId, AdminConversationJoinStatus.JOINED);
  };

  const handleAIResponseGenerationRequest = (sessionId: string) => {
    setIsGeneratingAIResponse(true);
    const sendMessage = sendMessageFnMap[sessionId];
    sendMessage({
      message: {
        content: '',
        event_type: 'RESPONSE_SUGGESTIONS',
        event_data: {
          query: currentConversation?.last_user_message,
        },
      },
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
              onClose={handleCloseJoinConversationDrawer}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ActiveConversationsLayout;
