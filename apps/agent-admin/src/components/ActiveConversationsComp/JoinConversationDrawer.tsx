import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import useSessionDetailsQuery from '../../queries/query/useSessionDetailsQuery';
import JoinConversationChatArea from './JoinConversationChatArea';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@neuraltrade/core/types/common';
import JoinConversationBottomBar from './JoinConversationBottomBar';
import { useMessageStore } from '../../hooks/useMessageStore';
import { SendAdminMessageFn, SendAdminMessageWithSessionIdFn } from '../../hooks/useAdminConversationWebSocket';
import { checkIsUserLeftMessage } from '@neuraltrade/core/utils/messageUtils';
import { MessageRole } from '@neuraltrade/shared/types/message';
import { useSessionStore } from '../../stores/useSessionStore';
import { getActiveJoinUser } from '../../utils/conversationUtils';

type JoinConversationDrawerProps = {
  conversation: ActiveConversation;
  onSendMessage?: SendAdminMessageWithSessionIdFn;
  onExitConversation: () => void;
  onAIResponseGenerationRequest: (sessionId: string, lastUserMessage: string) => void;
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
  const { updateSessionStatus, sessionsStatus, setIsGeneratingAIResponse, currentConversation } =
    useJoinConversationStore();
  const { messages, setMessages } = useMessageStore();
  const userInfo = useSessionStore((state) => state.userInfo);
  const currentUserId = userInfo?.id;
  const lastUserMessage = messages.filter((message) => message.role === MessageRole.USER).at(-1);
  const hasUserLeft = lastUserMessage && checkIsUserLeftMessage(lastUserMessage);

  const { data, isFetching, isError } = useSessionDetailsQuery(
    { sessionId: currentConversation?.session_id },
    {
      refetchOnMount: 'always',
    },
  );

  const { hasActiveJoin, activeUserId } = getActiveJoinUser(messages);
  const hasActiveJoinFromOtherUser = hasActiveJoin && activeUserId !== currentUserId;
  const hasActiveJoinForCurrentUser = activeUserId === currentUserId;

  useEffect(() => {
    if (isFetching || !data) return;

    setMessages(data.chat_history);

    return () => {
      setMessages([]);
    };
  }, [isFetching, data, setMessages]);

  useEffect(() => {
    if (isFetching || !data || !currentUserId || hasActiveJoinFromOtherUser) return;

    // Auto-reconnect: set session status to JOINED if current user has an active join
    if (hasActiveJoinForCurrentUser) {
      updateSessionStatus(sessionId, AdminConversationJoinStatus.JOINED);
    }
  }, [
    isFetching,
    data,
    sessionId,
    updateSessionStatus,
    currentUserId,
    hasActiveJoinForCurrentUser,
    hasActiveJoinFromOtherUser,
  ]);

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
    onAIResponseGenerationRequest(sessionId, lastUserMessage?.message?.content ?? '');
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
          className="z-50 m-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] rounded-2xl border-none bg-primary-foreground shadow-none outline-none"
          side="bottom"
          align="center"
          sideOffset={0}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex h-full w-full grow flex-col gap-2 overflow-hidden">
            <JoinConversationChatArea
              conversationDetails={data}
              sessionId={sessionId}
              isLoading={isFetching}
              hasUserLeft={hasUserLeft}
            />

            <JoinConversationBottomBar
              sessionStatus={sessionStatus}
              onSendMessage={handleSendMessage}
              onJoinButtonClick={handleJoinButtonClick}
              onAIResponseGenerationRequest={handleAIResponseGenerationRequest}
              onExit={onExitConversation}
              onClose={onClose}
              disableJoinButton={hasUserLeft || hasActiveJoinFromOtherUser}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default JoinConversationDrawer;
