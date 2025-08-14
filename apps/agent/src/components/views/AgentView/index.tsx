import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useMemo, useState } from 'react';

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
import PopupBannerContainer from './EntryPopupBanner/PopupBannerContainer.tsx';
import { EntryPointAlignment } from '@meaku/core/types/entryPoint';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { WidgetMode } from '@meaku/core/contexts/WidgetModeProvider';
import useSound from '@meaku/core/hooks/useSound';
import popupsound from '../../../assets/banner-sound.mp3';
import { PlaygroundView } from '@meaku/core/types/common';
import { useCycle } from '@breakout/design-system/hooks/useCycle';
import { useEntryPointStyling } from '../../../hooks/useEntryPointStyling.ts';

interface IProps {
  fetchSessionData: () => void;
}

const AgentView = ({ fetchSessionData }: IProps) => {
  const isMobile = useIsMobile();
  const [showPopupContent, setShowPopupContent] = useState(false);
  const [showOrbAfterBannerDisappear, setShowOrbAfterBannerDisappear] = useState(true);
  const { play } = useSound(popupsound, 0.1);

  const { handleSendUserMessage, lastMessage } = useWebSocketChat();
  const { getParam, setParam, setAgentOpen } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';
  const view = getParam('view');

  const {
    banner_config,
    entryPointAlignmentDesktop,
    entryPointAlignmentMobile,
    isAgentEnabled,
    initialSuggestedQuestions,
  } = useValuesFromConfigApi();

  const entry_point_alignment = isMobile
    ? entryPointAlignmentMobile || entryPointAlignmentDesktop
    : entryPointAlignmentDesktop;
  const validEntryPointAlignment = entry_point_alignment ?? EntryPointAlignment.CENTER;
  const showPopupBanner = !!banner_config?.show_banner && !isAgentOpen;

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState);

  const showSuggestedQuestions = initialSuggestedQuestions.length > 0 && !hasFirstUserMessageBeenSent;

  const showBanner = !!banner_config?.show_banner && !hasFirstUserMessageBeenSent && showPopupContent;
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

  const {
    isEntryPointOnTheBottomCenter,
    isEntryPointOnTheBottomRight,
    isEntryPointOnTheBottomLeft,
    isSideWiseEntryPoint,
  } = useEntryPointStyling({
    entryPointAlignment: validEntryPointAlignment,
    isMobile,
  });

  const { currentItemIndex, cycleCompleted } = useCycle({
    itemsLength: initialSuggestedQuestions.length,
    showItems: showSuggestedQuestions,
    cycleOnlyOnce: isSideWiseEntryPoint,
  });

  const { shouldHideBottomBar, isCollapsible, mode, shouldShowAgent } = useEmbedAppEvents({
    isAgentEnabled,
    fetchSessionData,
    handleOpenAgent,
    showBanner,
    cycleCompleted,
    hasFirstUserMessageBeenSent,
    entryPointAlignment: validEntryPointAlignment,
    handleSendUserMessage,
  });

  const handleCloseAgent = () => {
    setParam('isAgentOpen', 'false');
    handleUpdateOrbState(OrbStatusEnum.waiting);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CHAT_AREA_CLOSE, { isAgentOpen });
  };

  const getItemAlignment = () => {
    if (!hasFirstUserMessageBeenSent) {
      if (isEntryPointOnTheBottomRight) {
        return 'items-end justify-end';
      } else if (isEntryPointOnTheBottomLeft) {
        return 'items-end justify-start';
      } else {
        return 'items-end justify-center';
      }
    }
    return isSideWiseEntryPoint ? 'items-end' : 'items-center';
  };

  useTabNotification({ recentMessage: lastMessage });

  useSendMessageOnQueryParams({ handleSendMessage });

  const containerClassName = useMemo(() => {
    if (isAgentOpen && !isMobile && mode === WidgetMode.BOTTOM_BAR) {
      return 'mt-2 h-agent-open rounded-3xl';
    } else if (isMobile) {
      return 'mx-0 w-full h-dvh';
    } else if (mode === WidgetMode.INLINE_EMBEDDED || mode === WidgetMode.EMBEDDED_MODAL) {
      return 'mx-0 mt-0 h-screen w-screen rounded-3xl';
    } else return 'h-agent-open';
  }, [isMobile, isAgentOpen, mode]);

  useEffect(() => {
    if (shouldHideBottomBar || isAgentOpen) return;

    play();
  }, []);

  const agentInopenState = shouldShowAgent || view === PlaygroundView.USER_PREVIEW;

  let isAgentCollapsible = isCollapsible;
  if (view) {
    isAgentCollapsible = view !== PlaygroundView.USER_PREVIEW && isCollapsible;
  }

  return (
    <div className={cn(getItemAlignment(), 'mx-auto flex w-agent-open', containerClassName)}>
      <AgentInOpenState
        handleSendMessage={handleSendMessage}
        handleCloseAgent={handleCloseAgent}
        isCollapsible={isAgentCollapsible}
        showAgentInOpenState={agentInopenState && isAgentOpen}
      />
      <div
        className={cn('flex flex-col items-center justify-end', {
          hidden: shouldHideBottomBar || isAgentOpen,
          'h-full w-full': isEntryPointOnTheBottomCenter,
        })}
      >
        {/* TODO: Remove the !isMobile condition once we have a proper popup banner for mobile */}
        {showPopupBanner && !isMobile && (
          <PopupBannerContainer
            handleSendMessage={handleSendMessage}
            showPopupContent={isEntryPointOnTheBottomCenter ? showPopupContent : false}
            setShowPopupContent={setShowPopupContent}
            popupBannerAlignment={validEntryPointAlignment}
            setShowOrbAfterBannerDisappear={setShowOrbAfterBannerDisappear}
          />
        )}
        <EntryPointBottomBar
          handleSendUserMessage={handleSendMessage}
          handleOpenAgent={handleOpenAgent}
          showPopupContent={showPopupContent}
          entryPointAlignment={validEntryPointAlignment}
          showOrbAfterBannerDisappear={showOrbAfterBannerDisappear}
          currentItemIndex={currentItemIndex}
          cycleCompleted={cycleCompleted}
        />
      </div>
    </div>
  );
};

export default AgentView;
