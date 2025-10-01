import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTooltipPortal } from '../hooks/usePortal';

// Global tracking for initial tooltips - persists across component lifecycles
const globalInitialTooltipShown = new Set<string>();
const globalTooltipTimers = new Map<string, ReturnType<typeof setTimeout>>();

type InitialTooltipConfig = {
  delay: number;
  duration: number;
};

type BlackTooltipProps = {
  children: React.ReactNode;
  content: string;
  initialTooltip?: InitialTooltipConfig;
  side?: 'top' | 'right' | 'bottom' | 'left';
  usePortal?: boolean; // Default: true (for web components). Set to false only for direct web usage
  offset?: number; // Gap between tooltip and trigger element in pixels
  hoverDelay?: number; // Delay before showing tooltip on hover (in ms)
};

const BlackTooltip: React.FC<BlackTooltipProps> = ({
  children,
  content,
  initialTooltip,
  side = 'left',
  usePortal = true,
  offset = 8,
  hoverDelay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialTooltipActive, setIsInitialTooltipActive] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, transform: '' });
  const [isPositioned, setIsPositioned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Use the new portal system
  const { renderInPortal, getZIndex } = useTooltipPortal();

  // Handle initial tooltip sequence - only show once ever across all component lifecycles
  useEffect(() => {
    // Create a unique key based on content to track this specific tooltip
    const tooltipKey = content;

    if (initialTooltip && !globalInitialTooltipShown.has(tooltipKey)) {
      // Mark as started immediately to prevent multiple instances
      globalInitialTooltipShown.add(tooltipKey);

      // Use global timer to persist across component unmounts
      if (!globalTooltipTimers.has(tooltipKey)) {
        const globalTimer = setTimeout(() => {
          setIsInitialTooltipActive(true);
          setIsVisible(true);

          // Hide after duration
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              setIsInitialTooltipActive(false);
            }, 300); // Wait for fade out animation (matches transition duration)
          }, initialTooltip.duration);

          // Clean up global timer
          globalTooltipTimers.delete(tooltipKey);
        }, initialTooltip.delay);

        globalTooltipTimers.set(tooltipKey, globalTimer);
      }
    }

    return () => {
      // Only clear local timers on unmount, not global timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      // Note: Global timers persist across component unmounts
    };
  }, [initialTooltip, content]);

  // Recalculate position after tooltip is rendered and measured
  useEffect(() => {
    if (isVisible && tooltipRef.current && !isPositioned) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRect.height;
      const tooltipWidth = tooltipRect.width;

      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();

        let newPosition;
        switch (side) {
          case 'top':
            newPosition = {
              top: rect.top - tooltipHeight - offset,
              left: rect.left + rect.width / 2,
              transform: 'translateX(-50%)',
            };
            break;
          case 'bottom':
            newPosition = {
              top: rect.bottom + offset,
              left: rect.left + rect.width / 2,
              transform: 'translateX(-50%)',
            };
            break;
          case 'left':
            newPosition = {
              top: rect.top + rect.height / 2,
              left: rect.left - tooltipWidth - offset,
              transform: 'translateY(-50%)',
            };
            break;
          case 'right':
            newPosition = {
              top: rect.top + rect.height / 2,
              left: rect.right + offset,
              transform: 'translateY(-50%)',
            };
            break;
          default:
            newPosition = {
              top: rect.top - tooltipHeight - offset,
              left: rect.left + rect.width / 2,
              transform: 'translateX(-50%)',
            };
        }

        setTooltipPosition(newPosition);
        setIsPositioned(true);
      }
    }
  }, [isVisible, side, isPositioned, offset, content]);

  // Force repositioning when tooltip becomes visible (for hover tooltips)
  useEffect(() => {
    if (isVisible && !isInitialTooltipActive) {
      // For hover tooltips, always recalculate position
      setIsPositioned(false);
    }
  }, [isVisible, isInitialTooltipActive]);

  const handleMouseEnter = () => {
    if (!isInitialTooltipActive) {
      // Clear any existing hover timer
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      // Immediately set hover state
      setIsHovered(true);

      // Set a delay before showing the tooltip
      hoverTimerRef.current = setTimeout(() => {
        // Reset positioning state for hover tooltips
        setIsPositioned(false);
        setIsVisible(true);
        // Position will be calculated in the useEffect when tooltip becomes visible
      }, hoverDelay);
    }
  };

  const handleMouseLeave = () => {
    if (!isInitialTooltipActive) {
      // Clear the hover timer if user leaves before delay
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      setIsHovered(false);
      setIsVisible(false);
      setIsPositioned(false); // Reset positioning state
    }
  };

  // Get positioning classes and animations based on side
  const getTooltipConfig = () => {
    switch (side) {
      case 'top':
        return {
          container: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
          arrow: 'absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900',
          animation: {
            initial: { opacity: 0, y: 2, x: '-50%' },
            animate: { opacity: 1, y: -2, x: '-50%' },
            exit: { opacity: 0, y: 2, x: '-50%' },
          },
        };
      case 'bottom':
        return {
          container: 'absolute top-full left-1/2 -translate-x-1/2 mt-2',
          arrow: 'absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-b-gray-900',
          animation: {
            initial: { opacity: 0, y: -2, x: '-50%' },
            animate: { opacity: 1, y: 2, x: '-50%' },
            exit: { opacity: 0, y: -2, x: '-50%' },
          },
        };
      case 'left':
        return {
          container: 'absolute right-full top-1/2 -translate-y-1/2 mr-2',
          arrow: 'absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-4 border-transparent border-l-gray-900',
          animation: {
            initial: { opacity: 0, x: 2, y: '-50%' },
            animate: { opacity: 1, x: -2, y: '-50%' },
            exit: { opacity: 0, x: 2, y: '-50%' },
          },
        };
      case 'right':
      default:
        return {
          container: 'absolute left-full top-1/2 -translate-y-1/2 ml-2',
          arrow: 'absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-4 border-transparent border-r-gray-900',
          animation: {
            initial: { opacity: 0, x: -2, y: '-50%' },
            animate: { opacity: 1, x: 2, y: '-50%' },
            exit: { opacity: 0, x: -2, y: '-50%' },
          },
        };
    }
  };

  const tooltipConfig = getTooltipConfig();

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={tooltipConfig.animation.initial}
          animate={tooltipConfig.animation.animate}
          exit={tooltipConfig.animation.exit}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`${usePortal ? 'fixed' : tooltipConfig.container} px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg max-w-xl xs:max-w-xs whitespace-nowrap`}
          style={
            usePortal
              ? {
                  top: tooltipPosition.top,
                  left: tooltipPosition.left,
                  transform: tooltipPosition.transform,
                  zIndex: getZIndex(),
                  pointerEvents: 'auto',
                }
              : {}
          }
        >
          {content}
          {/* Arrow */}
          <div className={tooltipConfig.arrow} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-block before:absolute before:content-[''] before:-inset-[16px] before:z-[-1]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div data-hovered={isHovered}>{children}</div>

      {/* Tooltip - inline or portal */}
      {usePortal ? renderInPortal(tooltipContent) : tooltipContent}
    </div>
  );
};

export default BlackTooltip;
