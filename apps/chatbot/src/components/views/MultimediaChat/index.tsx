import { cn } from '@breakout/design-system/lib/cn';
import { memo, useEffect } from 'react';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import BottomBar from './BottomBar';
import ChatArea from './ChatArea';

interface IProps {
  fetchSessionData: () => void;
  handleSendUserMessage: (message: string) => Promise<void>;
}

const Multimedia = ({ fetchSessionData, handleSendUserMessage }: IProps) => {
  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  const isChatOpen = sessionData.isChatOpen;

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
    };

    window.parent.postMessage(payload, '*');
  }, [isChatOpen]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data;

      if (type === 'open-breakout-button') {
        fetchSessionData();
        handleOpenChat();
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
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
        <BottomBar handleSendUserMessage={handleSendMessage} handleOpenChat={handleOpenChat} />
      )}
    </div>
  );
};

export default memo(Multimedia);
