import { cn } from '@breakout/design-system/lib/cn';
import { memo } from 'react';

import EntryPointBottomBar from './EntryPointBottomBar.tsx';
import useAgentbotAnalytics from '../../../hooks/useAgentbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useWebSocketChat, { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';
import { useEmbedAppEvents } from '../../../hooks/useEmbedAppEvents.ts';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useUrlParams } from '../../../hooks/useUrlParams.ts';
import AgentInOpenState from './AgentInOpenState.tsx';

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
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.MESSAGE_SENT, { message: data.message });
  };

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handleOpenAgent = () => {
    setParam('isAgentOpen', 'true');
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen });
  };

  const { shouldHideBottomBar } = useEmbedAppEvents({ fetchSessionData, handleOpenAgent });

  const handleCloseAgent = () => {
    setParam('isAgentOpen', 'false');
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isAgentOpen });
  };

  return (
    <div
      className={cn('mx-auto mt-2 flex h-[95vh] w-[98vw] justify-center font-inter', {
        'rounded-2xl': isAgentOpen,
      })}
    >
      {isAgentOpen ? (
        <AgentInOpenState handleSendMessage={handleSendMessage} handleCloseAgent={handleCloseAgent} />
      ) : (
        <EntryPointBottomBar
          handleSendUserMessage={handleSendMessage}
          handleOpenAgent={handleOpenAgent}
          hideBottomBar={shouldHideBottomBar}
        />
      )}
    </div>
  );
};

export default memo(Multimedia);
