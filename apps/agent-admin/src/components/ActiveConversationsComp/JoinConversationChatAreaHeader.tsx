import ActiveConvLiveChatIcon from '@breakout/design-system/components/icons/active-conv-live-chat-icon';
import Button from '@breakout/design-system/components/layout/button';
import useJoinConversationStore from '../../stores/useJoinConversationStore';

const JoinConversationChatAreaHeader = () => {
  const { hasJoinedConversation, setHasJoinedConversation } = useJoinConversationStore();

  const handleExitConversation = () => {
    setHasJoinedConversation(false);
  };
  return (
    <div
      className="absolute left-0 top-0 z-50 flex w-full items-center justify-between rounded-t-lg 
      border border-gray-200 bg-[rgba(255,255,255,0.6)] px-4 py-2 backdrop-blur-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
          <ActiveConvLiveChatIcon className="h-6 w-6 text-primary" />
        </div>
        <p className="text-base font-medium text-gray-900">Live Chat</p>
      </div>
      {hasJoinedConversation && (
        <Button className="border-2 border-[rgba(var(--primary-foreground)/0.24)]" onClick={handleExitConversation}>
          Exit Conversation
        </Button>
      )}
    </div>
  );
};

export default JoinConversationChatAreaHeader;
