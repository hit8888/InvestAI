import { cn } from '@breakout/design-system/lib/cn';
import { memo } from 'react';
import EntryPointBottomBar from './EntryPointBottomBar';
import ChatArea from './ChatArea';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useWebSocketChat, { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';
import { useEmbedAppEvents } from '../../../hooks/useEmbedAppEvents.ts';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useUrlParams } from '../../../hooks/useUrlParams.ts';

interface IProps {
  fetchSessionData: () => void;
}

const Multimedia = ({ fetchSessionData }: IProps) => {
  const { handleSendUserMessage } = useWebSocketChat();
  const { getParam, setParam } = useUrlParams();

  const isChatOpen = getParam('isChatOpen') === 'true';

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const handleSendMessage = (data: IWebSocketHandleMessage) => {
    if (!hasFirstUserMessageBeenSent) {
      fetchSessionData();
    }
    if (!isChatOpen) {
      setParam('isChatOpen', 'true');
    }

    handleSendUserMessage(data);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.MESSAGE_SENT, { message: data.message });
  };

  const { trackChatbotEvent } = useChatbotAnalytics();

  const handleOpenChat = () => {
    setParam('isChatOpen', 'true');
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isChatOpen });
  };

  const { shouldHideBottomBar } = useEmbedAppEvents({ fetchSessionData, handleOpenChat });

  const handleCloseChat = () => {
    setParam('isChatOpen', 'false');
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isChatOpen });
  };

  return (
    <div className={isChatOpen ? 'flex h-screen w-full items-end justify-center pb-12' : ''}>
      <div
        className={cn('flex h-screen flex-col font-inter', {
          'rounded-2xl': isChatOpen,
          'hd:h-[95%] hd:w-[95%]': isChatOpen,
          'mac-air:h-[95%] mac-air:w-[95%]': isChatOpen,
          'hd-ready:h-[95%] hd-ready:w-[95%]': isChatOpen,
          'desktop:h-[95%] desktop:w-[95%]': isChatOpen,
          'mac-pro-14:h-[95%] mac-pro-14:w-[95%]': isChatOpen,
          'hd-plus:h-[95%] hd-plus:w-[95%]': isChatOpen,
          'mac-pro-16:h-[95%] mac-pro-16:w-[95%]': isChatOpen,
          'full-hd:h-[95%] full-hd:w-[95%]': isChatOpen,
          'qhd:h-[95%] qhd:w-[95%]': isChatOpen,
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
    </div>
  );
};

export default memo(Multimedia);
