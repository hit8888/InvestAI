import SingleActiveConversation from './SingleActiveConversation';
import { useSidebar } from '../../context/SidebarContext';
import { cn } from '@breakout/design-system/lib/cn';
import { ActiveConversationsContext } from '../../context/ActiveConversationsContext';
import { useContext } from 'react';
import LiveConversationsHeader from './LiveConversationsHeader';

const ActiveConversationsLayout = () => {
  const { isSidebarOpen } = useSidebar();

  // Explicitly using the string values.
  const widthDimension = isSidebarOpen
    ? 'mac-air:max-w-[1050px] mac-pro-14:max-w-[1200px] full-hd:max-w-[1600px] semi-qhd:max-w-[2000px] mac-pro-16:max-w-[1520px]'
    : 'mac-air:max-w-[1240px] mac-pro-14:max-w-[1400px] full-hd:max-w-[1800px] semi-qhd:max-w-[2170px] mac-pro-16:max-w-[1680px]';

  const totalActiveChats = 10;

  const { cards } = useContext(ActiveConversationsContext);
  const haveActiveConversations = cards.length > 0;
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-4 self-stretch rounded-2xl border border-primary/10 bg-primary/2.5 p-4',
        widthDimension,
      )}
    >
      {haveActiveConversations ? (
        <>
          <LiveConversationsHeader totalActiveChats={totalActiveChats} />
          {/* Horizontal Scroll Container */}
          <div className="w-full rounded-3xl">
            <div className="hide-scrollbar flex items-center gap-6 overflow-x-auto px-2 py-1">
              {cards.map((card) => (
                <SingleActiveConversation key={card.sessionId} card={card} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full items-center justify-center gap-4">
          <span className="h-8 w-8 animate-pulse rounded-full bg-primary"></span>
          <p className="gradient-text animate-pulse text-2xl">No active conversations right now</p>
        </div>
      )}
    </div>
  );
};

export default ActiveConversationsLayout;
