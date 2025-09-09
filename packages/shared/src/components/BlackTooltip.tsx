import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type InitialTooltipConfig = {
  delay: number;
  duration: number;
};

type BlackTooltipProps = {
  children: React.ReactNode;
  content: string;
  initialTooltip?: InitialTooltipConfig;
};

const BlackTooltip: React.FC<BlackTooltipProps> = ({ children, content, initialTooltip }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialTooltipActive, setIsInitialTooltipActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle initial tooltip sequence
  useEffect(() => {
    if (initialTooltip) {
      // Show initial tooltip after delay
      timerRef.current = setTimeout(() => {
        setIsInitialTooltipActive(true);
        setIsVisible(true);

        // Hide after duration
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setIsInitialTooltipActive(false);
          }, 300); // Wait for fade out animation (matches transition duration)
        }, initialTooltip.duration);
      }, initialTooltip.delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [initialTooltip]);

  const handleMouseEnter = () => {
    if (!isInitialTooltipActive) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isInitialTooltipActive) {
      setIsVisible(false);
    }
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div>{children}</div>

      {/* Tooltip with Framer Motion */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 8, y: '-50%' }}
            animate={{ opacity: 1, x: 0, y: '-50%' }}
            exit={{ opacity: 0, x: 8, y: '-50%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute right-full top-1/2 mr-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg max-w-xs whitespace-nowrap z-50"
          >
            {content}
            {/* Arrow */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlackTooltip;
