import { AnimatePresence } from 'framer-motion';
import PopupContent from './PopupContent';
import { useBannerPopupAnimation } from './useBannerPopupAnimation';
import { useMessageStore } from '../../../../stores/useMessageStore';
import useValuesFromConfigApi from '../../../../hooks/useValuesFromConfigApi';

interface ContainerProps {
  setShowOrbAfterBubblesDisappear: (value: boolean) => void;
  popupBannerAlignment: 'left' | 'center' | 'right';
  setShowPopupContent: (value: boolean) => void;
  showPopupContent: boolean;
}

const PopupWithBubblesContainer = ({
  setShowOrbAfterBubblesDisappear,
  popupBannerAlignment,
  setShowPopupContent,
  showPopupContent,
}: ContainerProps) => {
  const { banner_config, orgName, agentName, orbLogoUrl, showOrb } = useValuesFromConfigApi();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const show_banner = banner_config?.show_banner ?? true;
  const hide_after = banner_config?.hide_after ? banner_config?.hide_after : null;
  const show_at = banner_config?.show_at ?? 10; // default 10 seconds
  const header = banner_config?.header;
  const subheader = banner_config?.subheader;

  const { handleClosePopup } = useBannerPopupAnimation({
    setShowOrbAfterBubblesDisappear,
    setShowPopupContent,
    showPopupContent,
    hide_after,
    show_at,
  });

  const showBanner = show_banner && !hasFirstUserMessageBeenSent;

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showPopupContent && (
        <PopupContent
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

export default PopupWithBubblesContainer;
