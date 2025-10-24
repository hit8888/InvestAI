import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import ChipWithLabelAndCount from '@breakout/design-system/components/layout/ChipWithLabelAndCount';

type LiveConversationsHeaderProps = {
  isLoading?: boolean;
  totalActiveChats: number;
};

const LiveConversationsHeader = ({ isLoading, totalActiveChats }: LiveConversationsHeaderProps) => {
  if (isLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  return <ChipWithLabelAndCount label="Chat" count={totalActiveChats} />;
};

export default LiveConversationsHeader;
