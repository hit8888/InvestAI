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
import { OrbStatusEnum } from '@meaku/core/types/config';
interface IProps {
  fetchSessionData: () => void;
}

const AgentView = ({ fetchSessionData }: IProps) => {
  const [showBubbles, setShowBubbles] = useState(false);

  const { handleSendUserMessage } = useWebSocketChat();
  const { getParam, setParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const { banner_config, entry_point_alignment } = useConfigurationApiResponseManager().getStyleConfig();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState);

  const showBanner = banner_config?.show_banner && !hasFirstUserMessageBeenSent && showBubbles;
  const handleSendMessage = (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => {
    if (!hasFirstUserMessageBeenSent) {
      fetchSessionData();
    }
    if (!isAgentOpen) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen });
      setParam('isAgentOpen', 'true');
    }

    handleSendUserMessage(data);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.MESSAGE_SENT, { message: data.message });
  };

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handleOpenAgent = () => {
    setParam('isAgentOpen', 'true');
    handleUpdateOrbState(OrbStatusEnum.idle);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen });
  };

  const { shouldHideBottomBar, isCollapsible, mode } = useEmbedAppEvents({
    fetchSessionData,
    handleOpenAgent,
    showBanner: !!showBanner,
    hasFirstUserMessageBeenSent,
    entryPointAlignment: entry_point_alignment ?? 'center',
    handleSendUserMessage,
  });

  const handleCloseAgent = () => {
    setParam('isAgentOpen', 'false');
    handleUpdateOrbState(OrbStatusEnum.waiting);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isAgentOpen });
  };

  const isSideWiseEntryPoint = entry_point_alignment !== 'center';
  const getItemAlignment = () => {
    if (!hasFirstUserMessageBeenSent) {
      return isSideWiseEntryPoint ? 'items-end justify-end' : 'items-end justify-center';
    }
    return isSideWiseEntryPoint ? 'items-end' : 'items-center';
  };

  return (
    <div
      className={cn(getItemAlignment(), 'mx-auto flex h-[95vh] w-[97vw] font-inter', {
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
          entryPointAlignment={entry_point_alignment ?? 'center'}
        />
      )}
    </div>
  );
};

export default AgentView;
