import { useEffect, useState } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import PopupWithBubblesContainer from '../EntryPopupBanner/PopupWithBubblesContainer.tsx';
import EntryPointContentForBottomCenter from './EntryPointContentForBottomCenter.tsx';
import InsetAgentOpenButton from './InsetAgentOpenButton.tsx';
import SideWiseEntryPoint from './SideWiseEntryPoint.tsx';
import { useEntryPointStyling } from '../../../../hooks/useEntryPointStyling';
import { cn } from '@breakout/design-system/lib/cn';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { useMessageStore } from '../../../../stores/useMessageStore';

interface IProps {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleOpenAgent: () => void;
  hideBottomBar: boolean;
  showBubbles: boolean;
  setShowBubbles: (value: boolean) => void;
  entryPointAlignment: EntryPointAlignmentType;
}

const EntryPointBottomBar = ({
  hideBottomBar,
  handleSendUserMessage,
  handleOpenAgent,
  showBubbles,
  setShowBubbles,
  entryPointAlignment,
}: IProps) => {
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const { banner_config } = configurationApiResponseManager.getStyleConfig();
  const agentName = configurationApiResponseManager.getAgentName();

  const [showOrbAfterBubblesDisappear, setShowOrbAfterBubblesDisappear] = useState(!banner_config?.show_banner);

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const { getParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const { isEntryPointOnTheBottomCenter, isSideWiseEntryPoint, containerStyle } = useEntryPointStyling({
    entryPointAlignment,
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

  return (
    <div
      className={cn('z-10 flex p-0.5', {
        'absolute bottom-4 left-1/2 -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-2xl bg-gradient-to-bl from-primary/90 via-transparent to-primary/90':
          isEntryPointOnTheBottomCenter,
        'relative w-full items-end justify-start': !isEntryPointOnTheBottomCenter,
        hidden: hideBottomBar || isAgentOpen,
        'h-20 w-full': shouldShowOnlySidewiseEntryPointOrb,
      })}
      style={containerStyle}
    >
      <PopupWithBubblesContainer
        showBubbles={isEntryPointOnTheBottomCenter ? showBubbles : false}
        setShowBubbles={setShowBubbles}
        setShowOrbAfterBubblesDisappear={isEntryPointOnTheBottomCenter ? setShowOrbAfterBubblesDisappear : () => {}}
        popupBannerAlignment={entryPointAlignment}
      />
      {isSideWiseEntryPoint ? (
        <SideWiseEntryPoint
          handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
          entryPointAlignment={entryPointAlignment}
        />
      ) : (
        <EntryPointContentForBottomCenter
          showOrbAfterBubblesDisappear={showOrbAfterBubblesDisappear}
          entryPointAlignment={entryPointAlignment}
          handleSendUserMessage={handleSendUserMessage}
          handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
        />
      )}
      <InsetAgentOpenButton handleOpenAgent={handleOpenAgent} />
    </div>
  );
};

export default EntryPointBottomBar;
