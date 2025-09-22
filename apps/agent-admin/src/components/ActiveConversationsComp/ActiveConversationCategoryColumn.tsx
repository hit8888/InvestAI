import ActiveConversationCard from './ActiveConversationCard';
import { ActiveConversation } from '../../context/ActiveConversationsContext';

type ActiveConversationCategoryProps = {
  conversations: ActiveConversation[];
  onCardClick: (conversation: ActiveConversation) => void;
  onTogglePinned: (sessionId: string) => void;
  pinnedSessionIds: string[];
};

const ActiveConversationCategoryColumn = ({
  conversations,
  onCardClick,
  onTogglePinned,
  pinnedSessionIds,
}: ActiveConversationCategoryProps) => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
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
