import ActiveConversationCard from './ActiveConversationCard';
import { cn } from '@breakout/design-system/lib/cn';
import { ActiveConversationsContext } from '../../context/ActiveConversationsContext';
import { useContext, useState } from 'react';
import LiveConversationsHeader from './LiveConversationsHeader';
import { useTableWidth } from '../../hooks/useTableWidth';

const ActiveConversationsLayout = () => {
  const { widthStyle } = useTableWidth();
  const { activeConversations, isLoading } = useContext(ActiveConversationsContext);
  const [showActiveConversations, setShowActiveConversations] = useState(false);

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-4 self-stretch rounded-2xl border border-primary/10 bg-primary/2.5 p-4',
      )}
      style={widthStyle}
    >
      <>
        <LiveConversationsHeader
          isLoading={isLoading}
          totalActiveChats={activeConversations?.length ?? 0}
          isExpanded={showActiveConversations}
          onToggleView={() => setShowActiveConversations((prev) => !prev)}
        />
        {showActiveConversations && activeConversations?.length ? (
          <div className="w-full rounded-3xl">
            <div className="grid grid-cols-3 gap-4 overflow-hidden">
              {activeConversations.map((activeConversation) => (
                <ActiveConversationCard key={activeConversation.session_id} conversation={activeConversation} />
              ))}
            </div>
          </div>
        ) : null}
      </>
    </div>
  );
};

export default ActiveConversationsLayout;
