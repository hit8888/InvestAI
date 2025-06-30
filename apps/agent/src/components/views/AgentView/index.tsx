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
import useValuesFromConfigApi from '../../../hooks/useValuesFromConfigApi.tsx';
import { OrbStatusEnum } from '@meaku/core/types/config';
import useTabNotification from '@meaku/core/hooks/useTabNotification';
import PopupWithBubblesContainer from './EntryPopupBanner/PopupWithBubblesContainer.tsx';
import { EntryPointAlignment } from '@meaku/core/types/entryPoint';
interface IProps {
  fetchSessionData: () => void;
}

const AgentView = ({ fetchSessionData }: IProps) => {
  const [showPopupContent, setShowPopupContent] = useState(false);
  const [showOrbAfterBubblesDisappear, setShowOrbAfterBubblesDisappear] = useState(true);

  const { handleSendUserMessage, lastMessage } = useWebSocketChat();
  const { getParam, setParam, setAgentOpen } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const { banner_config, entry_point_alignment } = useValuesFromConfigApi();
  const showPopupBanner = !!banner_config?.show_banner;

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState);

  const showBanner = banner_config?.show_banner && !hasFirstUserMessageBeenSent && showPopupContent;
  const handleSendMessage = (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => {
    if (!hasFirstUserMessageBeenSent) {
      fetchSessionData();
    }
    if (!isAgentOpen) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen });
      setAgentOpen();
    }

    handleSendUserMessage(data);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.MESSAGE_SENT, { message: data.message });
  };

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handleOpenAgent = () => {
    setAgentOpen();
    handleUpdateOrbState(OrbStatusEnum.idle);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_OPEN, { isAgentOpen });
  };

  const { shouldHideBottomBar, isCollapsible, mode, shouldShowAgent } = useEmbedAppEvents({
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
  const isEntryPointOnTheBottomCenter = entry_point_alignment === EntryPointAlignment.CENTER;
  const getItemAlignment = () => {
    if (!hasFirstUserMessageBeenSent) {
      return isSideWiseEntryPoint ? 'items-end justify-end' : 'items-end justify-center';
    }
    return isSideWiseEntryPoint ? 'items-end' : 'items-center';
  };

  useTabNotification({ recentMessage: lastMessage });

  return (
    <div
      className={cn(getItemAlignment(), 'mx-auto flex h-[95vh] w-[97vw]', {
        'mt-2 rounded-3xl': isAgentOpen,
        'mx-0 mt-0 h-[100vh] w-[100vw]': mode === 'embed' || mode === 'overlay',
      })}
    >
      <AgentInOpenState
        handleSendMessage={handleSendMessage}
        handleCloseAgent={handleCloseAgent}
        isCollapsible={isCollapsible}
        showAgentInOpenState={shouldShowAgent && isAgentOpen}
      />
      <div
        className={cn('flex h-full w-full flex-col items-center justify-end', {
          hidden: shouldHideBottomBar || isAgentOpen,
        })}
      >
        {showPopupBanner && (
          <PopupWithBubblesContainer
            showPopupContent={isEntryPointOnTheBottomCenter ? showPopupContent : false}
            setShowPopupContent={setShowPopupContent}
            popupBannerAlignment={entry_point_alignment ?? 'center'}
            setShowOrbAfterBubblesDisappear={setShowOrbAfterBubblesDisappear}
          />
        )}
        <EntryPointBottomBar
          handleSendUserMessage={handleSendMessage}
          handleOpenAgent={handleOpenAgent}
          showPopupContent={showPopupContent}
          entryPointAlignment={entry_point_alignment ?? 'center'}
          showOrbAfterBubblesDisappear={showOrbAfterBubblesDisappear}
        />
      </div>
    </div>
  );
};

export default AgentView;
