import { ChevronUp, ChevronDown } from 'lucide-react';

type LiveConversationsHeaderProps = {
  isLoading?: boolean;
  totalActiveChats: number;
  isExpanded?: boolean;
  onToggleView?: () => void;
};

const LiveConversationsHeader = ({
  isLoading,
  totalActiveChats,
  isExpanded,
  onToggleView,
}: LiveConversationsHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold text-primary">Live conversations</p>
        {isLoading ? null : <LiveConversationsCount totalActiveChats={totalActiveChats} />}
      </div>

      {!isLoading && totalActiveChats === 0 ? <NoLiveConversations /> : null}
      {!isLoading && totalActiveChats > 0 ? (
        <ViewToggleButton isExpanded={isExpanded} onToggleView={onToggleView} />
      ) : null}
    </div>
  );
};

const LiveConversationsCount = ({ totalActiveChats }: Pick<LiveConversationsHeaderProps, 'totalActiveChats'>) => {
  if (totalActiveChats === 0) {
    return null;
  }

  const chatsLabel = totalActiveChats === 1 ? 'chat' : 'chats';

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-[30px] bg-primary/10 px-3 py-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60"></div>
      <span className="text-right text-sm font-medium text-primary/60">{`${totalActiveChats} ${chatsLabel}`}</span>
    </div>
  );
};

const NoLiveConversations = () => {
  return (
    <div className="text-xs text-gray-500">No Live Conversations currently. See below for the recent conversations</div>
  );
};

const ViewToggleButton = ({
  isExpanded,
  onToggleView,
}: Pick<LiveConversationsHeaderProps, 'isExpanded' | 'onToggleView'>) => {
  const actionButtonText = isExpanded ? 'Collapse' : 'Expand';
  const Icon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div
      onClick={onToggleView}
      className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-medium text-bluegray-1000 transition-colors hover:bg-gray-100"
    >
      <span>{actionButtonText}</span>
      <Icon size={16} className="text-bluegray-1000" />
    </div>
  );
};

export default LiveConversationsHeader;
