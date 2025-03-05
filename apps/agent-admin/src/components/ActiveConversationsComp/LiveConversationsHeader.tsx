type LiveConversationsHeaderProps = {
  totalActiveChats: number;
};

const LiveConversationsHeader = ({ totalActiveChats }: LiveConversationsHeaderProps) => {
  const chatsLabel = totalActiveChats === 1 ? 'chat' : 'chats';
  return (
    <div className="flex w-full items-start gap-4">
      <p className="flex-1 text-2xl font-semibold text-primary">Live conversations</p>
      <div className="flex items-center justify-center gap-2.5 rounded-[30px] bg-primary/10 px-3 py-1">
        <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60"></div>
        <span className="text-right text-sm font-medium text-primary/60">{`${totalActiveChats} ${chatsLabel}`}</span>
      </div>
    </div>
  );
};

export default LiveConversationsHeader;
