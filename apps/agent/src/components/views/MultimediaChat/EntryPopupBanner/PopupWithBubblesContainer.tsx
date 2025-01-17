import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { POPUP_BANNER_COOLDOWN_TIME } from '../../../../constants/localStorage';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import PopupContent, { PopupContentProps } from './PopupContent';
import PopupBubble from './PopupBubble';

interface ContainerProps extends PopupContentProps {
  showBubbles: boolean;
  setShowBubbles: (value: boolean) => void;
  showPopupContent: boolean;
  setShowPopupContent: (value: boolean) => void;
}

const PopupWithBubblesContainer = ({
  agentName,
  orgName,
  showBubbles,
  setShowBubbles,
  showPopupContent,
  setShowPopupContent,
}: ContainerProps) => {
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

    setShowBubbles(true);

    // Show popup content after bubbles are fully animated
    const popupTimer = setTimeout(() => {
      setShowPopupContent(true);
    }, 1000);

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
    }, 10000); // 10 + 1 seconds initial delay

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(exitTimer);
    };
  }, [hasShownOnce]);

  const handleClosePopup = () => {
    // Update session data to indicate popup has been closed for 24 hours
    handleUpdateSessionData({
      popupLastClosed: Date.now().toString(),
    });
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
          <PopupContent handleClosePopup={handleClosePopup} agentName={agentName} orgName={orgName} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PopupWithBubblesContainer;
