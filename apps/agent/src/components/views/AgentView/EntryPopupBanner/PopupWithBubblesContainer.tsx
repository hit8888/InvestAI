import { AnimatePresence } from 'framer-motion';
import PopupContent from './PopupContent';
import PopupBubble from './PopupBubble';
import { useBannerPopupAnimation } from './useBannerPopupAnimation';
import { useMessageStore } from '../../../../stores/useMessageStore';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';

interface ContainerProps {
  setShowOrbAfterBubblesDisappear: (value: boolean) => void;
  showBubbles: boolean;
  setShowBubbles: (value: boolean) => void;
  popupBannerAlignment: 'left' | 'center' | 'right';
}

const PopupWithBubblesContainer = ({
  setShowOrbAfterBubblesDisappear,
  showBubbles,
  setShowBubbles,
  popupBannerAlignment,
}: ContainerProps) => {
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const { banner_config } = configurationApiResponseManager.getStyleConfig();
  const orgName = configurationApiResponseManager.getOrgName();
  const agentName = configurationApiResponseManager.getAgentName();

  const show_banner = banner_config?.show_banner ?? true;
  const hide_after = banner_config?.hide_after ? parseInt(banner_config?.hide_after) : null;
  const show_at = banner_config?.show_at ?? '10'; // default 10 seconds
  const header = banner_config?.header;
  const subheader = banner_config?.subheader;

  const { showPopupContent, isExiting, handleClosePopup } = useBannerPopupAnimation({
    setShowOrbAfterBubblesDisappear,
    setShowBubbles,
    hide_after,
    show_at,
  });

  const showBanner = show_banner && !hasFirstUserMessageBeenSent;

  if (!showBanner) return null;

  return (
    <>
      <AnimatePresence>
        {showBubbles && (
          <>
            <PopupBubble size={10} delay={0} index={0} isExiting={isExiting} />
            <PopupBubble size={20} delay={0.4} index={1} isExiting={isExiting} />
            <PopupBubble size={40} delay={0.8} index={2} isExiting={isExiting} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopupContent && (
          <PopupContent
            handleClosePopup={handleClosePopup}
            agentName={agentName}
            orgName={orgName}
            header={header}
            subheader={subheader}
            popupBannerAlignment={popupBannerAlignment}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PopupWithBubblesContainer;
