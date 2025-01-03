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

const DEFAULT_HEIGHT = '96%';
const BASE_WIDTH = '98%';

// Breakpoint screens
const BREAKPOINTS = ['hd', 'mac-air', 'hd-ready', 'desktop', 'mac-pro-14', 'hd-plus', 'mac-pro-16', 'full-hd', 'qhd'];

const Multimedia = ({ fetchSessionData }: IProps) => {
  const { handleSendUserMessage } = useWebSocketChat();
  const { getParam, setParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const getBreakpointStyles = (height: string) => {
    return BREAKPOINTS.reduce(
      (acc, breakpoint) => ({
        ...acc,
        [`${breakpoint}:h-[${height}] ${breakpoint}:w-[${BASE_WIDTH}]`]: isAgentOpen,
      }),
      {},
    );
  };

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
    <div className={isAgentOpen ? 'flex h-screen w-full items-end justify-center pb-12' : ''}>
      <div
        className={cn('flex h-screen flex-col font-inter', {
          'rounded-2xl': isAgentOpen,
          ...getBreakpointStyles(DEFAULT_HEIGHT),
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
    </div>
  );
};

export default memo(Multimedia);
