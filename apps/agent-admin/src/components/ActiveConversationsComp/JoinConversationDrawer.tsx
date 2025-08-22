import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import useActiveConversationDetailsQuery from '../../queries/query/useActiveConversationDetailsQuery';
import JoinConversationChatArea from './JoinConversationChatArea';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import JoinConversationBottomBar from './JoinConversationBottomBar';
import { useMessageStore } from '../../hooks/useMessageStore';
import { SendAdminMessageFn, SendAdminMessageWithSessionIdFn } from '../../hooks/useAdminConversationWebSocket';
import { checkIsAdminJoinedMessage, checkIsAdminLeftMessage } from '@meaku/core/utils/messageUtils';

type JoinConversationDrawerProps = {
  conversation: ActiveConversation;
  onSendMessage?: SendAdminMessageWithSessionIdFn;
  onExitConversation: () => void;
  onAIResponseGenerationRequest: (sessionId: string) => void;
  onClose: () => void;
};

const JoinConversationDrawer = ({
  conversation,
  onSendMessage,
  onExitConversation,
  onAIResponseGenerationRequest,
  onClose,
}: JoinConversationDrawerProps) => {
  const { session_id: sessionId } = conversation;
  const { updateSessionStatus, sessionsStatus, setIsGeneratingAIResponse } = useJoinConversationStore();
  const { messages, setMessages } = useMessageStore();

  const { data, isFetching, isError } = useActiveConversationDetailsQuery(
    {},
    {
      refetchOnMount: 'always',
    },
  );

  useEffect(() => {
    if (isFetching || !data) return;

    setMessages(data.chat_history);

    return () => {
      setMessages([]);
    };
  }, [isFetching, data, setMessages]);

  useEffect(() => {
    if (isFetching || !data) return;

    const currentAdminSessionEvents = data.chat_history.filter(
      (message) => checkIsAdminJoinedMessage(message) || checkIsAdminLeftMessage(message),
    );
    const mostRecentSessionEvent = currentAdminSessionEvents[currentAdminSessionEvents.length - 1];

    if (mostRecentSessionEvent && checkIsAdminJoinedMessage(mostRecentSessionEvent)) {
      // Auto-reconnect: set session status to JOINED if most recent event is JOIN_SESSION
      updateSessionStatus(sessionId, AdminConversationJoinStatus.JOINED);
    }
  }, [isFetching, data, sessionId, updateSessionStatus]);

  useEffect(() => {
    return () => {
      setIsGeneratingAIResponse(false);
    };
  }, [setIsGeneratingAIResponse]);

  if (isError) {
    // TODO: track this error
    console.error('Error while fetching conversation details');
    return null;
  }

  const handleJoinButtonClick = () => {
    updateSessionStatus(sessionId, AdminConversationJoinStatus.PENDING);
  };

  const handleSendMessage: SendAdminMessageFn = (payload) => {
    onSendMessage?.(sessionId, payload);
  };

  const handleAIResponseGenerationRequest = () => {
    onAIResponseGenerationRequest(sessionId);
  };

  const sessionStatus = sessionsStatus[sessionId];

  return (
    <>
      <Popover open onOpenChange={onClose}>
        <div className="fixed inset-0 z-50 bg-black/50" />
        <PopoverTrigger asChild>
          <div className="hidden" />
        </PopoverTrigger>
        <PopoverContent
          className="z-50 m-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] rounded-2xl border-none bg-primary-foreground p-2 shadow-none outline-none"
          side="bottom"
          align="center"
          sideOffset={0}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex h-full w-full grow flex-col gap-2 overflow-hidden">
            <JoinConversationChatArea conversationDetails={data} sessionId={sessionId} isLoading={isFetching} />

            {messages.length === 0 ? null : (
              <JoinConversationBottomBar
                sessionStatus={sessionStatus}
                onSendMessage={handleSendMessage}
                onJoinButtonClick={handleJoinButtonClick}
                onAIResponseGenerationRequest={handleAIResponseGenerationRequest}
                onExit={onExitConversation}
                onClose={onClose}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default JoinConversationDrawer;
