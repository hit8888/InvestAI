import { AnimatePresence } from 'framer-motion';
import PopupContent from './PopupContent';
import { useBannerPopupAnimation } from './useBannerPopupAnimation';
import { useMessageStore } from '../../../../stores/useMessageStore';
import useValuesFromConfigApi from '../../../../hooks/useValuesFromConfigApi';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';

interface ContainerProps {
  setShowOrbAfterBannerDisappear: (value: boolean) => void;
  popupBannerAlignment: 'left' | 'center' | 'right';
  setShowPopupContent: (value: boolean) => void;
  showPopupContent: boolean;
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

const PopupBannerContainer = ({
  setShowOrbAfterBannerDisappear,
  popupBannerAlignment,
  setShowPopupContent,
  showPopupContent,
  handleSendMessage,
}: ContainerProps) => {
  const { banner_config, orgName, agentName, orbLogoUrl, showOrb } = useValuesFromConfigApi();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const show_banner = banner_config?.show_banner ?? true;
  const hide_after = banner_config?.hide_after ? banner_config?.hide_after : null;
  const show_at = banner_config?.show_at ?? 10; // default 10 seconds
  const header = banner_config?.header;
  const subheader = banner_config?.subheader;

  const { handleClosePopup } = useBannerPopupAnimation({
    setShowOrbAfterBannerDisappear,
    setShowPopupContent,
    showPopupContent,
    hide_after,
    show_at,
  });

  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const { setAgentOpen } = useUrlParams();

  const showBanner = show_banner && !hasFirstUserMessageBeenSent;

  const handlePopupContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAgentOpen();
    if (subheader) {
      handleSendMessage({ message: { content: `Elaborate on ${subheader}` }, message_type: 'TEXT' });
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.BANNER_CLICKED_FIRST_MESSAGE, {
        message: subheader,
        isAgentOpen: true,
      });
    }
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showPopupContent && (
        <PopupContent
          handlePopupContentClick={handlePopupContentClick}
          handleClosePopup={handleClosePopup}
          agentName={agentName}
          orgName={orgName}
          header={header}
          subheader={subheader}
          popupBannerAlignment={popupBannerAlignment}
          orbLogoUrl={orbLogoUrl}
          showOrb={showOrb}
        />
      )}
    </AnimatePresence>
  );
};

export default PopupBannerContainer;
