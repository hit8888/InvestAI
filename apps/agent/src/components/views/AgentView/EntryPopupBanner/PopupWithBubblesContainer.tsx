import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { POPUP_BANNER_COOLDOWN_TIME } from '../../../../constants/localStorage';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import PopupContent, { PopupContentProps } from './PopupContent';
import PopupBubble from './PopupBubble';

interface ContainerProps extends PopupContentProps {
  setShowOrbAfterBubblesDisappear: (value: boolean) => void;
  showBubbles: boolean;
  setShowBubbles: (value: boolean) => void;
  header: string | undefined | null;
  subheader: string | undefined | null;
  popupBannerAlignment: 'left' | 'center' | 'right';
}

const PopupWithBubblesContainer = ({
  agentName,
  orgName,
  setShowOrbAfterBubblesDisappear,
  showBubbles,
  setShowBubbles,
  header,
  subheader,
  popupBannerAlignment,
}: ContainerProps) => {
  const [showPopupContent, setShowPopupContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  // Check if popup is in cooldown period
  const isPopupInCooldown = useCallback(() => {
    const lastClosedTime = sessionData.popupLastClosed;
    if (!lastClosedTime) return false;
    const timeSinceLastClosed = Date.now() - parseInt(lastClosedTime);

    return timeSinceLastClosed < POPUP_BANNER_COOLDOWN_TIME;
  }, []);

  useEffect(() => {
    if (hasShownOnce || isPopupInCooldown()) return;

    // Show bubbles after 10 seconds
    const bubbleTimer = setTimeout(() => {
      setShowBubbles(true);
    }, 10000);

    // Show popup content after bubbles are fully animated
    const popupTimer = setTimeout(() => {
      setShowPopupContent(true);
    }, 11000);

    // Start exit sequence after 10 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // First hide popup content
      setShowPopupContent(false);

      // Then hide bubbles after popup content animation completes
      setTimeout(() => {
        setShowBubbles(false);
        setHasShownOnce(true);
      }, 500); // Match popup exit duration

      // Show Orb Inside Entry bar After Bubbles Disappear
      setTimeout(() => {
        setShowOrbAfterBubblesDisappear(true);
      }, 1500); // 1.5 seconds delay
    }, 20000); // 10 + 10 seconds initial delay

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(exitTimer);
      clearTimeout(bubbleTimer);
    };
  }, [hasShownOnce]);

  const handleClosePopup = () => {
    // Update session data to indicate popup has been closed for 24 hours
    handleUpdateSessionData({
      popupLastClosed: Date.now().toString(),
    });
    setShowOrbAfterBubblesDisappear(true);
    setShowPopupContent(false);
    setShowBubbles(false);
  };
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
