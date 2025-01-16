import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import PopupCloseIcon from '@breakout/design-system/components/icons/popup-close-icon';

const Bubble = ({
  size,
  delay,
  index,
  isExiting,
}: {
  size: number;
  delay: number;
  index: number;
  isExiting: boolean;
}) => (
  <motion.div
    initial={{ scale: 0, y: 0, opacity: 0 }}
    animate={{
      scale: 1,
      y: index === 2 ? -index * 20 : index === 1 ? -30 + index * 20 : -20,
      x: index === 2 ? -20 - index * 20 : index === 1 ? -10 - index * 20 : -index * 20,
      opacity: 1,
    }}
    exit={{
      scale: 0,
      y: 0,
      x: 0,
      opacity: 0,
      transition: {
        delay: (2 - index) * 0.3, // Reverse order exit
        duration: 0.5,
      },
    }}
    transition={{
      duration: 0.8,
      delay: isExiting ? 0 : delay,
    }}
    className="absolute -left-4 bottom-0 -translate-x-1/2 rounded-full border-2 border-primary-foreground/55 bg-primary/80"
    style={{
      width: size,
      height: size,
      zIndex: 10,
    }}
  />
);

type IProps = {
  agentName: string;
  orgName: string;
  handleClosePopup?: () => void;
};

const PopupContent = ({ agentName, orgName, handleClosePopup }: IProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.5 }}
    className="absolute -left-52 -top-32 rounded-3xl"
    style={{ zIndex: 20 }}
  >
    <div className="popupGradient-container flex border-2 border-primary-foreground/55 p-4">
      <div className="flex items-center gap-4">
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <Orb color="rgb(var(--primary))" state={OrbStatusEnum.waiting} />
        </div>
        <div className="flex flex-col items-start gap-1 pl-12">
          <div className="flex w-full justify-between">
            <p className="flex-1 text-lg font-semibold text-white">
              Hi! I am {agentName} <span className="absolute animate-wave">👋</span>
            </p>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/35"
              onClick={handleClosePopup}
            >
              <PopupCloseIcon width={'18'} height={'18'} color="white" />
            </button>
          </div>
          <p className="self-stretch text-sm font-normal text-white">
            I'm here to introduce you to {orgName} and help you discover what it can do.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

interface ContainerProps extends IProps {
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

  useEffect(() => {
    if (hasShownOnce) return;

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
    setShowPopupContent(false);
    setShowBubbles(false);
  };
  return (
    <>
      <AnimatePresence>
        {showBubbles && (
          <>
            <Bubble size={10} delay={0} index={0} isExiting={isExiting} />
            <Bubble size={20} delay={0.2} index={1} isExiting={isExiting} />
            <Bubble size={40} delay={0.4} index={2} isExiting={isExiting} />
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
