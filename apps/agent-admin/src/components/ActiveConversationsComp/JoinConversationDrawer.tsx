import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import JoinConversationHeader from './JoinConversationHeader';
import JoinConversationChatArea from './JoinConversationChatArea';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import useJoinConversationStore, { JoinConversationStatus } from '../../stores/useJoinConversationStore';
import { WebSocketTextMessage } from '../../hooks/useJoinConversationWebSocket';
import JoinConversationBottomBar from './JoinConversationBottomBar';

type JoinConversationDrawerProps = {
  conversation: ActiveConversation | null;
  onSendMessage?: (sessionId: string, message: WebSocketTextMessage) => void;
  onClose: () => void;
};

const JoinConversationDrawer = ({ conversation, onSendMessage, onClose }: JoinConversationDrawerProps) => {
  if (!conversation) return null;

  return (
    <Drawer open={true} onOpenChange={onClose} direction="bottom">
      <DrawerOverlay className="fixed inset-0 bg-black/50" />
      <DrawerContent className="z-[1000] mx-2 h-[90vh] rounded-2xl bg-primary-foreground px-2 pb-2">
        <JoinConversationHeader conversation={conversation} />
        <div className="flex h-[98%] w-full items-start justify-end gap-2 self-stretch rounded-3xl border border-gray-200 bg-gray-50 p-2">
          <JoinConversationContent sessionId={conversation.session_id} onSendMessage={onSendMessage} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type JoinConversationContentProps = {
  sessionId: string;
  onSendMessage?: (sessionId: string, message: WebSocketTextMessage) => void;
};

const JoinConversationContent = ({ sessionId, onSendMessage }: JoinConversationContentProps) => {
  const { updateSessionStatus, sessionsStatus } = useJoinConversationStore();

  const handleJoinButtonClick = () => {
    updateSessionStatus(sessionId, JoinConversationStatus.PENDING);
  };

  const handleSendMessage = (message: WebSocketTextMessage) => {
    onSendMessage?.(sessionId, message);
  };

  const sessionStatus = sessionsStatus[sessionId];

  return (
    <div className="flex h-full w-full flex-1 flex-col items-start gap-2 self-stretch">
      <JoinConversationChatArea sessionID={sessionId} />

      <JoinConversationBottomBar
        sessionStatus={sessionStatus}
        onSendMessage={handleSendMessage}
        onJoinButtonClick={handleJoinButtonClick}
      />
    </div>
  );
};

export default JoinConversationDrawer;
