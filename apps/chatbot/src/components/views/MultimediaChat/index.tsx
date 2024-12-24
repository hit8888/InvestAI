import { cn } from '@breakout/design-system/lib/cn';
import { memo } from 'react';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import EntryPointBottomBar from './EntryPointBottomBar';
import ChatArea from './ChatArea';
import { useHandleAppStateOnUnmount } from '../../../pages/shared/hooks/useHandleAppStateOnUnmount';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useWebSocketChat, { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';
import { useEmbedAppEvents } from '../../../hooks/useEmbedAppEvents.ts';
import { useMessageStore } from '../../../stores/useMessageStore.ts';

interface IProps {
  fetchSessionData: () => void;
}

const Multimedia = ({ fetchSessionData }: IProps) => {
  const { handleSendUserMessage } = useWebSocketChat();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const handleSendMessage = (data: IWebSocketHandleMessage) => {
    if (!hasFirstUserMessageBeenSent) {
      fetchSessionData();
    }
    if (!isChatOpen) {
      handleUpdateSessionData({ isChatOpen: true });
    }

    handleSendUserMessage(data);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.MESSAGE_SENT, { message: data.message });
  };

  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  const { trackChatbotEvent } = useChatbotAnalytics();
  useHandleAppStateOnUnmount();

  const isChatOpen = sessionData.isChatOpen;

  const showTooltip = !isChatOpen && (sessionData?.showTooltip ?? true);

  const handleOpenChat = () => {
    handleUpdateSessionData({ isChatOpen: true });
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isChatOpen, showTooltip });
  };

  const { shouldHideBottomBar } = useEmbedAppEvents({ fetchSessionData, handleOpenChat });

  const handleCloseChat = () => {
    handleUpdateSessionData({ isChatOpen: false });
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isChatOpen, showTooltip });
  };

  return (
    <div
      className={cn('flex h-screen flex-col font-inter', {
        'rounded-2xl': isChatOpen,
      })}
    >
      {isChatOpen ? (
        <ChatArea handleSendMessage={handleSendMessage} handleCloseChat={handleCloseChat} />
      ) : (
        <EntryPointBottomBar
          handleSendUserMessage={handleSendMessage}
          handleOpenChat={handleOpenChat}
          hideBottomBar={shouldHideBottomBar}
        />
      )}
    </div>
  );
};

export default memo(Multimedia);
