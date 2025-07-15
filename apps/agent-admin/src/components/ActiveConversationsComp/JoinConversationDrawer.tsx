import { useContext, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import useActiveConversationDetailsDataQuery from '../../queries/query/useActiveConversationDetailsDataQuery';
import JoinConversationChatArea from './JoinConversationChatArea';
import { ActiveConversation, ActiveConversationsContext } from '../../context/ActiveConversationsContext';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import JoinConversationBottomBar from './JoinConversationBottomBar';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import { useActiveConversationDetails } from '../../context/ActiveConversationDetailsContext';
import { useMessageStore } from '../../hooks/useMessageStore';
import { SendAdminMessageFn, SendAdminMessageWithSessionIdFn } from '../../hooks/useAdminConversationWebSocket';

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
  const { readyState } = useContext(ActiveConversationsContext);
  const { chatHistory, setChatHistory, setChatSummary, setBrowsedUrls, setSession } = useActiveConversationDetails();
  const { setMessages } = useMessageStore();

  const queryOptions = useQueryOptions();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchChatHistory,
  } = useActiveConversationDetailsDataQuery({
    sessionID: sessionId,
    queryOptions,
    queryParams: {
      chat_summary_required: 'true',
    },
  });

  useEffect(() => {
    if (isLoading || !data) return;

    setChatHistory(data.chat_history);
    setMessages(data.chat_history);
    setChatSummary(data.chat_summary);
    setBrowsedUrls(data.prospect?.browsed_urls ?? []);
    setSession(data.session);

    return () => {
      setChatHistory([]);
      setMessages([]);
      setChatSummary('');
    };
  }, [isLoading, data]);

  useEffect(() => {
    return () => {
      setIsGeneratingAIResponse(false);
    };
  }, [setIsGeneratingAIResponse]);

  useEffect(() => {
    if (readyState === WebSocket.OPEN) {
      refetchChatHistory();
    }
  }, [readyState]);

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
            <JoinConversationChatArea sessionId={sessionId} isLoading={isLoading} />

            {!chatHistory || chatHistory.length === 0 ? null : (
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
