import { useCallback, useEffect, useState } from 'react';
import { POPUP_BANNER_COOLDOWN_TIME } from '../../../../constants/localStorage';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';

interface UseBannerPopupAnimationProps {
  setShowOrbAfterBubblesDisappear: (value: boolean) => void;
  hide_after?: number | null;
  show_at?: number;
  setShowPopupContent: (value: boolean) => void;
  showPopupContent: boolean;
}

interface UseBannerPopupAnimationReturn {
  showPopupContent: boolean;
  handleClosePopup: () => void;
}

export const useBannerPopupAnimation = ({
  setShowOrbAfterBubblesDisappear,
  hide_after = 10,
  show_at = 10,
  setShowPopupContent,
  showPopupContent,
}: UseBannerPopupAnimationProps): UseBannerPopupAnimationReturn => {
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

    const showAtMs = show_at * 1000;
    const hideAfterMs = hide_after ? hide_after * 1000 : null;

    // Show popup content after show_at seconds
    const popupTimer = setTimeout(() => {
      setShowPopupContent(true);
    }, showAtMs);

    // Only set up exit timer if hide_after is provided
    if (hideAfterMs) {
      const exitTimer = setTimeout(() => {
        // First hide popup content
        setShowPopupContent(false);
        setHasShownOnce(true);

        // Show Orb Inside Entry bar After hide_after seconds
        setShowOrbAfterBubblesDisappear(true);
      }, showAtMs + hideAfterMs);

      return () => {
        clearTimeout(exitTimer);
      };
    }

    return () => {
      clearTimeout(popupTimer);
    };
  }, [hasShownOnce, isPopupInCooldown, setShowOrbAfterBubblesDisappear, show_at, hide_after]);

  const handleClosePopup = () => {
    handleUpdateSessionData({
      popupLastClosed: Date.now().toString(),
    });
    setShowOrbAfterBubblesDisappear(true);
    setShowPopupContent(false);
  };

  return {
    showPopupContent,
    handleClosePopup,
  };
};
