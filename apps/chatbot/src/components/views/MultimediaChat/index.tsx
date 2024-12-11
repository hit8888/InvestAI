import { cn } from '@breakout/design-system/lib/cn';
import { memo, useEffect, useState } from 'react';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import BottomBar from './BottomBar';
import ChatArea from './ChatArea';
import { useHandleAppStateOnUnmount } from '../../../pages/shared/hooks/useHandleAppStateOnUnmount';

interface IProps {
  fetchSessionData: () => void;
  handleSendUserMessage: (message: string) => Promise<void>;
}

const Multimedia = ({ fetchSessionData, handleSendUserMessage }: IProps) => {
  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();
  const [shouldShowBottomBar, setShouldShowBottomBar] = useState(true);
  useHandleAppStateOnUnmount();

  const isChatOpen = sessionData.isChatOpen;

  const showTooltip = !isChatOpen && (sessionData?.showTooltip ?? true);

  const handleOpenChat = () => {
    handleUpdateSessionData({ isChatOpen: true });
  };

  const handleCloseChat = () => {
    handleUpdateSessionData({ isChatOpen: false });
  };

  const handleSendMessage = (message: string) => {
    fetchSessionData();
    if (!isChatOpen) {
      handleUpdateSessionData({ isChatOpen: true });
    }
    handleSendUserMessage(message);
  };

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };
    window.parent.postMessage(payload, '*');
  }, [isChatOpen, showTooltip]);

  useEffect(() => {
    const handleParentWindowMessages = (event: MessageEvent) => {
      const { type } = event.data;
      console.log({ type });

      if (type === 'open-breakout-button') {
        fetchSessionData();
        handleOpenChat();
      }

      if (type === 'show-bottom-bar') {
        setShouldShowBottomBar(true);
      }
    };
    window.addEventListener('message', handleParentWindowMessages);

    return () => {
      window.removeEventListener('message', handleParentWindowMessages);
    };
  }, []);

  return (
    <div
      className={cn('flex h-screen flex-col font-inter', {
        'rounded-2xl': isChatOpen,
      })}
    >
      {isChatOpen ? (
        <ChatArea handleSendMessage={handleSendMessage} handleCloseChat={handleCloseChat} />
      ) : (
        <BottomBar
          handleSendUserMessage={handleSendMessage}
          handleOpenChat={handleOpenChat}
          shouldShowBottomBar={shouldShowBottomBar}
        />
      )}
    </div>
  );
};

export default memo(Multimedia);
