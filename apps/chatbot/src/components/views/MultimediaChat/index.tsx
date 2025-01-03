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
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const handleSendMessage = (data: IWebSocketHandleMessage) => {
    if (!hasFirstUserMessageBeenSent) {
      fetchSessionData();
    }
    if (!isAgentOpen) {
      setParam('isAgentOpen', 'true');
    }

    handleSendUserMessage(data);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.MESSAGE_SENT, { message: data.message });
  };

  const { trackChatbotEvent } = useChatbotAnalytics();

  const handleOpenChat = () => {
    setParam('isAgentOpen', 'true');
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen });
  };

  const { shouldHideBottomBar } = useEmbedAppEvents({ fetchSessionData, handleOpenChat });

  const handleCloseChat = () => {
    setParam('isAgentOpen', 'false');
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isAgentOpen });
  };

  return (
    <div
      className={cn('mx-auto mt-2 flex h-[95vh] w-[98vw] justify-center font-inter', {
        'rounded-2xl': isAgentOpen,
      })}
    >
      {isAgentOpen ? (
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
