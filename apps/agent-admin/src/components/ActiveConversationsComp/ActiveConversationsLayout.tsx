import ActiveConversationCard from './ActiveConversationCard';
import { cn } from '@breakout/design-system/lib/cn';
import { ActiveConversation, ActiveConversationsContext } from '../../context/ActiveConversationsContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import LiveConversationsHeader from './LiveConversationsHeader';
import { useTableWidth } from '@breakout/design-system/hooks/useTableWidth';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import JoinConversationDrawer from './JoinConversationDrawer';
import WebSocketManager from './WebSocketManager';
import { SendAdminMessageWithSessionIdFn, SendMessageFn } from '../../hooks/useAdminConversationWebSocket';
import { useSidebar } from '../../context/SidebarContext';
import { ActiveConversationDetailsProvider } from '../../context/ActiveConversationDetailsContext';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ActiveConversationsLayout = () => {
  const { isSidebarOpen } = useSidebar();
  const { widthStyle } = useTableWidth({ isSidebarOpen });
  const { activeConversations, isLoading } = useContext(ActiveConversationsContext);
  const [showActiveConversations, setShowActiveConversations] = useState(true);
  const [sendMessageFnMap, setSendMessageFnMap] = useState<Record<string, SendMessageFn>>({});
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const {
    currentConversation,
    sessionsStatus,
    setCurrentConversation,
    updateSessionStatus,
    setIsGeneratingAIResponse,
  } = useJoinConversationStore();

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
    <div
      className={cn(
        'flex flex-col items-start gap-4 self-stretch rounded-2xl border border-primary/10 bg-primary/2.5 p-4',
      )}
      style={widthStyle}
    >
      <>
        <LiveConversationsHeader
          isLoading={isLoading}
          totalActiveChats={activeConversations?.length ?? 0}
          isExpanded={showActiveConversations}
          onToggleView={() => setShowActiveConversations((prev) => !prev)}
        />
        {activeConversations?.length ? (
          <div className={cn('w-full rounded-3xl', showActiveConversations ? 'block' : 'hidden')}>
            <div className="grid grid-cols-3 gap-4 overflow-hidden">
              {activeConversations.map((activeConversation) => (
                <ActiveConversationCard
                  key={activeConversation.session_id}
                  conversation={activeConversation}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>

            {activeConversations.map((conversation) => (
              <WebSocketManager
                key={conversation.session_id}
                sessionId={conversation.session_id}
                onWebSocketChange={handleWebSocketChange}
                onConnected={handleWebSocketConnected}
              />
            ))}

            <ActiveConversationDetailsProvider>
              {currentConversation ? (
                <JoinConversationDrawer
                  conversation={currentConversation}
                  onSendMessage={handleSendMessage}
                  onExitConversation={handleExitConversation}
                  onAIResponseGenerationRequest={handleAIResponseGenerationRequest}
                  onClose={handleCloseJoinConversationDrawer}
                />
              ) : null}
            </ActiveConversationDetailsProvider>
          </div>
        ) : null}
      </>
    </div>
  );
};

export default ActiveConversationsLayout;
