import { useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerTitle,
} from '@breakout/design-system/components/Drawer/index';
import useActiveConversationDetailsDataQuery from '../../queries/query/useActiveConversationDetailsDataQuery';
import JoinConversationHeader from './JoinConversationHeader';
import JoinConversationChatArea from './JoinConversationChatArea';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import JoinConversationBottomBar from './JoinConversationBottomBar';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import { useActiveConversationDetails } from '../../context/ActiveConversationDetailsContext';
import { useMessageStore } from '../../hooks/useMessageStore';

type JoinConversationDrawerProps = {
  conversation: ActiveConversation;
  onSendMessage?: (sessionId: string, message: string) => void;
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
  const { updateSessionStatus, sessionsStatus } = useJoinConversationStore();
  const { chatHistory, setChatHistory, setChatSummary } = useActiveConversationDetails();
  const { setMessages } = useMessageStore();

  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useActiveConversationDetailsDataQuery({
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

    return () => {
      setChatHistory([]);
      setMessages([]);
      setChatSummary('');
    };
  }, [isLoading]);

  if (isError) {
    // TODO: track this error
    console.error('Error while fetching conversation details');
    return null;
  }

  const handleJoinButtonClick = () => {
    updateSessionStatus(sessionId, AdminConversationJoinStatus.JOINED);
  };

  const handleSendMessage = (message: string) => {
    onSendMessage?.(sessionId, message);
  };

  const handleAIResponseGenerationRequest = () => {
    onAIResponseGenerationRequest(sessionId);
  };

  const sessionStatus = sessionsStatus[sessionId];

  return (
    <Drawer open={true} onOpenChange={onClose} direction="bottom">
      <DrawerOverlay className="fixed inset-0 bg-black/50" />
      {/* Preventing Console Errors and warnings */}
      <DrawerTitle className="sr-only"></DrawerTitle>
      <DrawerDescription className="sr-only"></DrawerDescription>

      <DrawerContent className="z-[1000] mx-2 h-[90vh] rounded-2xl bg-primary-foreground px-2 pb-2">
        <JoinConversationHeader conversation={conversation} onExitConversation={onExitConversation} />

        <div className="flex w-full grow flex-col gap-2 overflow-hidden">
          <JoinConversationChatArea sessionId={sessionId} isLoading={isLoading} />

          {!chatHistory || chatHistory.length === 0 ? null : (
            <JoinConversationBottomBar
              sessionStatus={sessionStatus}
              onSendMessage={handleSendMessage}
              onJoinButtonClick={handleJoinButtonClick}
              onAIResponseGenerationRequest={handleAIResponseGenerationRequest}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default JoinConversationDrawer;
