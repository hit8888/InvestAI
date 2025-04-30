import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import JoinConversationHeader from './JoinConversationHeader';
import JoinConversationEntryPointInput from './JoinConversationEntryPointInput';
import JoinConversationChatAreaBody from './JoinConversationChatAreaBody';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { ActiveConversation } from '../../context/ActiveConversationsContext';

type JoinConversationDrawerProps = {
  conversation: ActiveConversation;
  isOpen: boolean;
  onClose: () => void;
};

const JoinConversationDrawer = ({ conversation, isOpen, onClose }: JoinConversationDrawerProps) => {
  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="bottom">
      <DrawerOverlay className="fixed inset-0 bg-black/50" />
      <DrawerContent className="inset-x-3 z-[1000] h-[90vh] rounded-2xl bg-primary-foreground">
        <JoinConversationHeader conversation={conversation} />
        <JoinConversationLeftSideBodyContent sessionID={conversation.session_id} />
      </DrawerContent>
    </Drawer>
  );
};

const JoinConversationLeftSideBodyContent = ({ sessionID }: { sessionID: string }) => {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-start gap-2 self-stretch p-2 pt-0">
      <JoinConversationChatAreaContainer sessionID={sessionID} />
      <div className="w-full rounded-lg border border-gray-200 bg-white px-1 py-1">
        <div className="w-full rounded-lg border border-gray-300 bg-white p-3">
          <JoinConversationEntryPointInput />
        </div>
      </div>
    </div>
  );
};

const JoinConversationChatAreaContainer = ({ sessionID }: { sessionID: string }) => {
  const { hasJoinedConversation } = useJoinConversationStore();
  return (
    <div className="flex h-full w-full flex-1 flex-col items-start self-stretch rounded-lg">
      <JoinConversationChatAreaBody sessionID={sessionID} />
      {!hasJoinedConversation && <div className="pointer-events-none absolute inset-0 rounded-2xl" />}
    </div>
  );
};

export default JoinConversationDrawer;
