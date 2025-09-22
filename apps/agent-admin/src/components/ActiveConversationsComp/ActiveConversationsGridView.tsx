import { useMemo } from 'react';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import ActiveConversationCategoryColumn from './ActiveConversationCategoryColumn';

interface GridViewProps {
  conversations: ActiveConversation[];
  onCardClick: (conversation: ActiveConversation) => void;
  onTogglePinned: (sessionId: string) => void;
  pinnedSessionIds: string[];
}

const COLUMNS_COUNT = 3;

const ActiveConversationsGridView = ({
  conversations,
  onCardClick,
  onTogglePinned,
  pinnedSessionIds,
}: GridViewProps) => {
  const distributedConversations = useMemo(() => {
    const columns: ActiveConversation[][] = Array.from({ length: COLUMNS_COUNT }, () => []);

    conversations?.forEach((conversation, index) => {
      columns[index % COLUMNS_COUNT].push(conversation);
    });

    return columns.map((conversationsData, index) => ({
      columnIndex: index,
      conversationsData,
    }));
  }, [conversations]);

  return (
    <div className="grid h-full min-h-[80vh] grid-cols-3 gap-4">
      {distributedConversations.map(({ columnIndex, conversationsData }) => (
        <ActiveConversationCategoryColumn
          key={columnIndex}
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
