import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

type LiveConversationsHeaderProps = {
  isLoading?: boolean;
  totalActiveChats: number;
};

const LiveConversationsHeader = ({ isLoading, totalActiveChats }: LiveConversationsHeaderProps) => {
  if (isLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  return totalActiveChats > 0 ? <LiveConversationsCount totalActiveChats={totalActiveChats} /> : null;
};

const LiveConversationsCount = ({ totalActiveChats }: Pick<LiveConversationsHeaderProps, 'totalActiveChats'>) => {
  const chatsLabel = totalActiveChats === 1 ? 'Chat' : 'Chats';

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-[30px] bg-primary/10 px-3 py-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60"></div>
      <span className="text-right text-sm font-medium text-primary/60">{`${totalActiveChats} ${chatsLabel}`}</span>
    </div>
  );
};

export default LiveConversationsHeader;
