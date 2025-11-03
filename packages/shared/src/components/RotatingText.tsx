import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  /** Array of strings to rotate through */
  texts: string[];
  /** Interval in milliseconds between rotations (default: 3000) */
  rotationInterval?: number;
  /** Delay in milliseconds for the fade transition (default: 150) */
  transitionDelay?: number;
  /** Pause rotation when true (e.g., on hover) */
  pauseOnHover?: boolean;
  /** Custom className for the text wrapper */
  className?: string;
  /** Custom animation transition */
  transition?: {
    duration?: number;
    ease?: number[] | string;
  };
  /** Callback when the current index changes */
  onIndexChange?: (index: number) => void;
  /** Initial index (default: 0) */
  initialIndex?: number;
}

/**
 * Reusable component for rotating through an array of text strings with smooth animations.
 * Extracted from RotatingQuestionButton to be shared across components.
 */
export const RotatingText = ({
  texts,
  rotationInterval = 3000,
  transitionDelay = 150,
  pauseOnHover = false,
  className = '',
  transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  onIndexChange,
  initialIndex = 0,
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (texts.length <= 1 || (pauseOnHover && isHovered)) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      setIsVisible(false);

      // Clear any existing timeout before setting a new one
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => {
          const newIndex = (prev + 1) % texts.length;
          onIndexChange?.(newIndex);
          return newIndex;
        });
        setIsVisible(true);
        timeoutId = null;
      }, transitionDelay);
    }, rotationInterval);

    return () => {
      clearInterval(interval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [texts.length, rotationInterval, transitionDelay, pauseOnHover, isHovered, onIndexChange]);

  // If only one text, just render it without animation
  if (texts.length <= 1) {
    return <span className={className}>{texts[0] || ''}</span>;
  }

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className={className}
          >
            {texts[currentIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
