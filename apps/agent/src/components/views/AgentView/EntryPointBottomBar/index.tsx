import { useEffect, useState } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import PopupBannerContent from './PopupBannerContent.tsx';
import EntryPointContentForBottomCenter from './EntryPointContentForBottomCenter.tsx';
import InsetAgentOpenButton from './InsetAgentOpenButton.tsx';
import SideWiseEntryPoint from './SideWiseEntryPoint.tsx';
import { useEntryPointStyling } from '../../../../hooks/useEntryPointStyling';

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
  const { banner_config, shadow_enabled } = configurationApiResponseManager.getStyleConfig();
  const agentName = configurationApiResponseManager.getAgentName();

  const [showOrbAfterBubblesDisappear, setShowOrbAfterBubblesDisappear] = useState(!banner_config?.show_banner);

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const {
    isEntryPointOnTheBottomCenter,
    isSideWiseEntryPoint,
    stylingForParentContainerSidewiseEntryPoint,
    stylingForParentContainerBottomCenterEntryPoint,
    containerStyle,
  } = useEntryPointStyling({
    hideBottomBar,
    shadow_enabled,
    entryPointAlignment,
  });

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
      className={
        isEntryPointOnTheBottomCenter
          ? stylingForParentContainerBottomCenterEntryPoint
          : stylingForParentContainerSidewiseEntryPoint
      }
      style={containerStyle}
    >
      <PopupBannerContent
        showBubbles={isEntryPointOnTheBottomCenter ? showBubbles : false}
        setShowBubbles={setShowBubbles}
        setShowOrbAfterBubblesDisappear={isEntryPointOnTheBottomCenter ? setShowOrbAfterBubblesDisappear : () => {}}
        entryPointAlignment={entryPointAlignment}
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
