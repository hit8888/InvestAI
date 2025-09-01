import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

import ActiveConversationCard from './ActiveConversationCard';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import { BuyerIntent } from '@meaku/core/types/common';

type ActiveConversationCategoryProps = {
  intent: BuyerIntent;
  conversations: ActiveConversation[];
  onCardClick: (conversation: ActiveConversation) => void;
  onTogglePinned: (sessionId: string) => void;
  pinnedSessionIds: string[];
};

const getIcon = (intent: BuyerIntent) => {
  switch (intent) {
    case BuyerIntent.HIGH:
      return <TrendingUp className="size-4 text-gray-900" />;
    case BuyerIntent.MEDIUM:
      return <ArrowRight className="size-4 text-gray-900" />;
    case BuyerIntent.LOW:
      return <TrendingDown className="size-4 text-gray-900" />;
    default:
      return <TrendingUp className="size-4 text-gray-900" />;
  }
};

const getTitle = (intent: BuyerIntent) => {
  switch (intent) {
    case BuyerIntent.HIGH:
      return 'High Intent';
    case BuyerIntent.MEDIUM:
      return 'Medium Intent';
    case BuyerIntent.LOW:
      return 'Low Intent';
    default:
      return '';
  }
};

const ActiveConversationCategoryColumn = ({
  intent,
  conversations,
  onCardClick,
  onTogglePinned,
  pinnedSessionIds,
}: ActiveConversationCategoryProps) => {
  const columnTitle = getTitle(intent);
  const columnIcon = getIcon(intent);

  if (!columnTitle) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between rounded-t-lg border-b-2 border-gray-200 bg-gray-100 p-2">
        <div className="flex items-center gap-2">
          {columnIcon}
          <span className="text-sm font-normal text-gray-900">{columnTitle}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-2">
        {conversations?.map((conversation) => (
          <ActiveConversationCard
            key={conversation.session_id}
            conversation={conversation}
            onCardClick={() => onCardClick(conversation)}
            isPinned={pinnedSessionIds.includes(conversation.session_id)}
            onTogglePinned={() => onTogglePinned(conversation.session_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveConversationCategoryColumn;
