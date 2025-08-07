import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

type LiveConversationsHeaderProps = {
  isLoading?: boolean;
  totalActiveChats: number;
};

const LiveConversationsHeader = ({ isLoading, totalActiveChats }: LiveConversationsHeaderProps) => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-24" />
      </>
    );
  }

  return totalActiveChats > 0 ? (
    <div className="flex w-full items-center justify-between gap-4">
      <LiveConversationsCount totalActiveChats={totalActiveChats} />
    </div>
  ) : null;
};

const LiveConversationsCount = ({ totalActiveChats }: Pick<LiveConversationsHeaderProps, 'totalActiveChats'>) => {
  const chatsLabel = totalActiveChats === 1 ? 'Live User' : 'Live Users';

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-[30px] bg-primary/10 px-3 py-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60"></div>
      <span className="text-right text-sm font-medium text-primary/60">{`${totalActiveChats} ${chatsLabel}`}</span>
    </div>
  );
};

export default LiveConversationsHeader;
