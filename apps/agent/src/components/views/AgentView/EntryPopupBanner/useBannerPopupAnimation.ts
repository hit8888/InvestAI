import { useCallback, useEffect, useState } from 'react';
import { POPUP_BANNER_COOLDOWN_TIME } from '../../../../constants/localStorage';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';

interface UseBannerPopupAnimationProps {
  setShowOrbAfterBubblesDisappear: (value: boolean) => void;
  setShowBubbles: (value: boolean) => void;
  hide_after?: number | null;
  show_at?: string;
}

interface UseBannerPopupAnimationReturn {
  showPopupContent: boolean;
  isExiting: boolean;
  handleClosePopup: () => void;
}

export const useBannerPopupAnimation = ({
  setShowOrbAfterBubblesDisappear,
  setShowBubbles,
  hide_after = 10,
  show_at = '10',
}: UseBannerPopupAnimationProps): UseBannerPopupAnimationReturn => {
  const [showPopupContent, setShowPopupContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  const isPopupInCooldown = useCallback(() => {
    const lastClosedTime = sessionData.popupLastClosed;
    if (!lastClosedTime) return false;
    const timeSinceLastClosed = Date.now() - parseInt(lastClosedTime);
    return timeSinceLastClosed < POPUP_BANNER_COOLDOWN_TIME;
  }, [sessionData.popupLastClosed]);

  useEffect(() => {
    if (hasShownOnce || isPopupInCooldown()) return;

    const showAtMs = parseInt(show_at) * 1000;
    const hideAfterMs = hide_after ? hide_after * 1000 : null;

    // Show bubbles after show_at seconds
    const bubbleTimer = setTimeout(() => {
      setShowBubbles(true);
    }, showAtMs);

    // Show popup content after bubbles are fully animated
    const popupTimer = setTimeout(() => {
      setShowPopupContent(true);
    }, showAtMs + 1000); // 1 second after bubbles

    // Only set up exit timer if hide_after is provided
    if (hideAfterMs) {
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
      }, showAtMs + hideAfterMs);

      return () => {
        clearTimeout(exitTimer);
      };
    }

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(bubbleTimer);
    };
  }, [hasShownOnce, isPopupInCooldown, setShowBubbles, setShowOrbAfterBubblesDisappear, show_at, hide_after]);

  const handleClosePopup = () => {
    handleUpdateSessionData({
      popupLastClosed: Date.now().toString(),
    });
    setShowOrbAfterBubblesDisappear(true);
    setShowPopupContent(false);
    setShowBubbles(false);
  };

  return {
    showPopupContent,
    isExiting,
    handleClosePopup,
  };
};
