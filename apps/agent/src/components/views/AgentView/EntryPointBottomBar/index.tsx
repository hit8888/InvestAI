import { useEffect, useMemo } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useValuesFromConfigApi from '../../../../hooks/useValuesFromConfigApi.tsx';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import EntryPointContentForBottomCenter from './EntryPointContentForBottomCenter.tsx';
import InsetAgentOpenButton from './InsetAgentOpenButton.tsx';
import SideWiseEntryPoint from './SideWiseEntryPoint.tsx';
import { useEntryPointStyling } from '../../../../hooks/useEntryPointStyling';
import { cn } from '@breakout/design-system/lib/cn';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface IProps {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleOpenAgent: () => void;
  showPopupContent: boolean;
  entryPointAlignment: EntryPointAlignmentType;
  showOrbAfterBannerDisappear: boolean;
  currentItemIndex: number;
  cycleCompleted: boolean;
}

const EntryPointBottomBar = ({
  handleSendUserMessage,
  handleOpenAgent,
  showPopupContent,
  entryPointAlignment,
  showOrbAfterBannerDisappear,
  currentItemIndex,
  cycleCompleted,
}: IProps) => {
  const isMobile = useIsMobile();
  const { agentName } = useValuesFromConfigApi();
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const { getParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const { isEntryPointOnTheBottomCenter, isSideWiseEntryPoint, containerStyle } = useEntryPointStyling({
    entryPointAlignment,
    isMobile,
  });

  const shouldShowOnlySidewiseEntryPointOrb = isSideWiseEntryPoint && !isAgentOpen && hasFirstUserMessageBeenSent;
  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage({
      message: { content: msg, event_data: {}, event_type: 'SUGGESTED_QUESTION_CLICKED' },
      message_type: 'EVENT',
    });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.INITIAL_SUGGESTED_QUESTION_CLICKED, {
      message: msg,
      isAgentOpen: false,
      initialSuggestedQuestion: true,
    });
  };

  useEffect(() => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SHOW_BOTTOM_BAR);
  }, [agentName]);

  const openInsetAgentButton = useMemo(() => {
    if (isMobile) {
      return isEntryPointOnTheBottomCenter;
    } else {
      if (hasFirstUserMessageBeenSent) {
        return true;
      } else {
        return false;
      }
    }
  }, [isMobile, hasFirstUserMessageBeenSent]);

  const entryPointBottomBarClassName = useMemo(() => {
    if (isEntryPointOnTheBottomCenter) {
      return `absolute ${isMobile ? 'bottom-1' : 'bottom-4'} left-1/2 -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-2xl bg-gradient-to-bl from-primary/90 via-transparent to-primary/90`;
    } else if (!isEntryPointOnTheBottomCenter) {
      return 'relative items-end justify-end';
    } else if (shouldShowOnlySidewiseEntryPointOrb) {
      return 'h-20 w-full';
    }
  }, [isEntryPointOnTheBottomCenter, shouldShowOnlySidewiseEntryPointOrb]);

  return (
    <div className={cn('z-10 flex p-0.5', entryPointBottomBarClassName)} style={containerStyle}>
      {isSideWiseEntryPoint ? (
        <SideWiseEntryPoint
          handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
          entryPointAlignment={entryPointAlignment}
          currentItemIndex={currentItemIndex}
          cycleCompleted={cycleCompleted}
        />
      ) : (
        <EntryPointContentForBottomCenter
          isMobile={isMobile}
          showOrbAfterBannerDisappear={showOrbAfterBannerDisappear && !showPopupContent}
          entryPointAlignment={entryPointAlignment}
          handleSendUserMessage={handleSendUserMessage}
          handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
        />
      )}
      <InsetAgentOpenButton openInsetAgentButton={openInsetAgentButton} handleOpenAgent={handleOpenAgent} />
    </div>
  );
};

export default EntryPointBottomBar;
