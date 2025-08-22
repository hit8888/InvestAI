import { useMemo } from 'react';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import ActiveConversationCategoryColumn from './ActiveConversationCategoryColumn';
import { BuyerIntent } from '@meaku/core/types/common';

interface GridViewProps {
  conversations: ActiveConversation[];
  onCardClick: (conversation: ActiveConversation) => void;
  onTogglePinned: (sessionId: string) => void;
  pinnedSessionIds: string[];
}

const ActiveConversationsGridView = ({
  conversations,
  onCardClick,
  onTogglePinned,
  pinnedSessionIds,
}: GridViewProps) => {
  const categorizedConversations = useMemo(() => {
    return [
      {
        intentLabel: BuyerIntent.LOW,
        conversationsData: conversations?.filter((c) => c.buyer_intent === BuyerIntent.LOW) ?? [],
      },
      {
        intentLabel: BuyerIntent.MEDIUM,
        conversationsData: conversations?.filter((c) => c.buyer_intent === BuyerIntent.MEDIUM) ?? [],
      },
      {
        intentLabel: BuyerIntent.HIGH,
        conversationsData: conversations?.filter((c) => c.buyer_intent === BuyerIntent.HIGH) ?? [],
      },
    ];
  }, [conversations]);

  return (
    <div className="grid h-full min-h-[80vh] grid-cols-3 gap-4">
      {categorizedConversations.map(({ intentLabel, conversationsData }) => (
        <ActiveConversationCategoryColumn
          key={intentLabel}
          intent={intentLabel}
          conversations={conversationsData}
          onCardClick={onCardClick}
          onTogglePinned={onTogglePinned}
          pinnedSessionIds={pinnedSessionIds}
        />
      ))}
    </div>
  );
};

export default ActiveConversationsGridView;
