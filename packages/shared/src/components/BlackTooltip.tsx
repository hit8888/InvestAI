import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTooltipPortal } from '../hooks/usePortal';
import {
  useFloating,
  offset as floatingOffset,
  flip,
  shift,
  arrow as floatingArrow,
  autoUpdate,
  type Placement,
  FloatingArrow,
} from '@floating-ui/react';

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
  offset = 12,
  hoverDelay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialTooltipActive, setIsInitialTooltipActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Use the new portal system
  const { renderInPortal, getZIndexClass } = useTooltipPortal();

  // Floating UI for dynamic positioning with scroll/resize handling
  const { refs, floatingStyles, placement, context } = useFloating({
    placement: side as Placement,
    open: isVisible,
    strategy: usePortal ? 'fixed' : 'absolute', // Use fixed for portals, absolute for inline
    middleware: [floatingOffset(offset), flip(), shift({ padding: 5 }), floatingArrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate, // Auto-reposition on scroll/resize - fixes mobile issue
  });

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
        setIsVisible(true);
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
    }
  };

  // Get directional animation based on placement (original smooth values)
  const getDirectionalAnimation = () => {
    const baseSide = placement.split('-')[0];
    switch (baseSide) {
      case 'top':
        return { initial: { y: 2 }, animate: { y: -2 }, exit: { y: 2 } };
      case 'bottom':
        return { initial: { y: -2 }, animate: { y: 2 }, exit: { y: -2 } };
      case 'left':
        return { initial: { x: 2 }, animate: { x: -2 }, exit: { x: 2 } };
      case 'right':
        return { initial: { x: -2 }, animate: { x: 2 }, exit: { x: -2 } };
      default:
        return { initial: { y: 2 }, animate: { y: -2 }, exit: { y: 2 } };
    }
  };

  const dirAnimation = getDirectionalAnimation();

  // Tooltip content with fade + directional slide animation (original smooth timing)
  // Use wrapper pattern: outer div for positioning, inner div for animation
  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <div
          ref={refs.setFloating}
          className={getZIndexClass()}
          style={{
            position: floatingStyles.position,
            top: floatingStyles.top,
            left: floatingStyles.left,
            transform: floatingStyles.transform, // Floating UI's positioning transform
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, ...dirAnimation.initial }}
            animate={{ opacity: 1, ...dirAnimation.animate }}
            exit={{ opacity: 0, ...dirAnimation.exit }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg xs:max-w-xs"
          >
            {content}
            {/* Use Floating UI's arrow component */}
            <FloatingArrow ref={arrowRef} context={context} fill="#111827" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={refs.setReference}
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
