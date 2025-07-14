import { cn } from '@breakout/design-system/lib/cn';
import { useMemo, useState } from 'react';

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
import useSendMessageOnQueryParams from '@meaku/core/hooks/useSendMessageOnQueryParams';
import PopupWithBubblesContainer from './EntryPopupBanner/PopupWithBubblesContainer.tsx';
import { EntryPointAlignment } from '@meaku/core/types/entryPoint';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
interface IProps {
  fetchSessionData: () => void;
}

const AgentView = ({ fetchSessionData }: IProps) => {
  const isMobile = useIsMobile();
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

  useSendMessageOnQueryParams({ handleSendMessage });

  const containerClassName = useMemo(() => {
    if (isAgentOpen && !isMobile) {
      return 'mt-2 h-[95vh] rounded-3xl';
    } else if (isMobile) {
      return 'mt-2 h-[calc(100dvh-40px)]';
    } else if (mode === 'embed' || mode === 'overlay') {
      return 'mx-0 mt-0 h-[100vh] w-[100vw]';
    }
  }, [isMobile, isAgentOpen, mode]);

  return (
    <div className={cn(getItemAlignment(), 'mx-auto flex w-[97vw]', containerClassName)}>
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
        {/* TODO: Remove the !isMobile condition once we have a proper popup banner for mobile */}
        {showPopupBanner && !isMobile && (
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
