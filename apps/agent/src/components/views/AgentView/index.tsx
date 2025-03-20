import { cn } from '@breakout/design-system/lib/cn';
import { useState } from 'react';

import EntryPointBottomBar from './EntryPointBottomBar/index.tsx';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import { useEmbedAppEvents } from '@meaku/core/hooks/useEmbedAppEvents';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import AgentInOpenState from './AgentInOpenState.tsx';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';

interface IProps {
  fetchSessionData: () => void;
}

const AgentView = ({ fetchSessionData }: IProps) => {
  const [showBubbles, setShowBubbles] = useState(false);

  const { handleSendUserMessage } = useWebSocketChat();
  const { getParam, setParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const { banner_config } = useConfigurationApiResponseManager().getStyleConfig();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const showBanner = banner_config?.show_banner && !hasFirstUserMessageBeenSent && showBubbles;
  const handleSendMessage = (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => {
    if (!hasFirstUserMessageBeenSent) {
      fetchSessionData();
    }
    if (!isAgentOpen) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen: true });
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

  const { shouldHideBottomBar, isCollapsible, mode } = useEmbedAppEvents({
    fetchSessionData,
    handleOpenAgent,
    showBanner: !!showBanner,
    hasFirstUserMessageBeenSent,
    handleSendUserMessage,
  });

  const handleCloseAgent = () => {
    setParam('isAgentOpen', 'false');
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isAgentOpen });
  };

  return (
    <div
      className={cn('mx-auto flex h-[95vh] w-[90vw] justify-center font-inter', {
        'mt-2 rounded-3xl': isAgentOpen,
        'mx-0 mt-0 h-[100vh] w-[100vw]': mode === 'embed' || mode === 'overlay',
      })}
    >
      {isAgentOpen ? (
        <AgentInOpenState
          handleSendMessage={handleSendMessage}
          handleCloseAgent={handleCloseAgent}
          isCollapsible={isCollapsible}
        />
      ) : (
        <EntryPointBottomBar
          handleSendUserMessage={handleSendMessage}
          handleOpenAgent={handleOpenAgent}
          hideBottomBar={shouldHideBottomBar}
          showBubbles={showBubbles}
          setShowBubbles={setShowBubbles}
        />
      )}
    </div>
  );
};

export default AgentView;
