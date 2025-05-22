import ActiveConversationCard from './ActiveConversationCard';
import { cn } from '@breakout/design-system/lib/cn';
import { ActiveConversation, ActiveConversationsContext } from '../../context/ActiveConversationsContext';
import { useCallback, useContext, useState } from 'react';
import LiveConversationsHeader from './LiveConversationsHeader';
import { useTableWidth } from '@breakout/design-system/hooks/useTableWidth';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import JoinConversationDrawer from './JoinConversationDrawer';
import WebSocketManager from './WebSocketManager';
import { SendMessageFn } from '../../hooks/useAdminConversationWebSocket';
import { useSidebar } from '../../context/SidebarContext';
import { ActiveConversationDetailsProvider } from '../../context/ActiveConversationDetailsContext';

const ActiveConversationsLayout = () => {
  const { isSidebarOpen } = useSidebar();
  const { widthStyle } = useTableWidth({ isSidebarOpen });
  const { activeConversations, isLoading } = useContext(ActiveConversationsContext);
  const [showActiveConversations, setShowActiveConversations] = useState(false);
  const [sendMessageFnMap, setSendMessageFnMap] = useState<Record<string, SendMessageFn>>({});

  const { currentConversation, setCurrentConversation } = useJoinConversationStore();

  const handleCardClick = (conversation: ActiveConversation) => {
    setCurrentConversation(conversation);
  };

  const handleCloseJoinConversationDrawer = () => {
    setCurrentConversation(null);
  };

  const handleWebSocketChange = useCallback((sessionId: string, sendMessage: SendMessageFn) => {
    setSendMessageFnMap((sendMessageFnMap) => ({
      ...sendMessageFnMap,
      [sessionId]: sendMessage,
    }));
  }, []);

  const handleSendMessage = (sessionId: string, textMessage: string) => {
    const sendMessage = sendMessageFnMap[sessionId];

    sendMessage({
      message: {
        content: textMessage,
        event_type: 'ADMIN_RESPONSE',
        event_data: {},
      },
      message_type: 'EVENT',
    });
  };

  const handleAIResponseGenerationRequest = (sessionId: string) => {
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
        {showActiveConversations && activeConversations?.length ? (
          <div className="w-full rounded-3xl">
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
              />
            ))}

            <ActiveConversationDetailsProvider>
              {currentConversation ? (
                <JoinConversationDrawer
                  conversation={currentConversation}
                  onSendMessage={handleSendMessage}
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
