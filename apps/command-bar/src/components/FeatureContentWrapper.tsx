import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { querySelector } from '@meaku/shared/utils/dom-utils';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { ENV } from '@meaku/shared/constants/env';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { COMPONENT_TRANSITIONS } from '../constants/animationTimings';

export interface FeatureContentWrapperProps {
  children: React.ReactNode;
  activeFeature: CommandBarModuleType | null;
  isExpanded: boolean;
}

const getMaxAvailableHeight = () => {
  const minTopGap = 16;
  const minBottomGap = 16;
  return window.innerHeight - minTopGap - minBottomGap;
};

const getModuleStyles = (
  activeFeature: CommandBarModuleType,
  position: { bottom: number; maxHeight: number; transform: string },
) => {
  const baseStyles = {
    bottom: position.bottom,
    transform: position.transform,
    maxHeight: position.maxHeight,
  };

  switch (activeFeature) {
    case 'ASK_AI':
      return {
        ...baseStyles,
        height: position.maxHeight, // Force full height for Ask AI
      };

    case 'VIDEO_LIBRARY':
      return {
        ...baseStyles,
        // Set optimal height for content to render without scrolling
        height: Math.min(position.maxHeight, 800),
      };
    default:
      return {
        ...baseStyles,
        // No forced height - let it size based on content
      };
  }
};

const getInnerModuleStyles = (activeFeature: CommandBarModuleType, position: { maxHeight: number }) => {
  const baseStyles = {
    maxHeight: position.maxHeight,
  };

  switch (activeFeature) {
    case 'ASK_AI':
      return {
        ...baseStyles,
        height: position.maxHeight, // Force full height for Ask AI
      };
    case 'VIDEO_LIBRARY':
      return {
        ...baseStyles,
        // Set optimal height for content to render without scrolling
        maxHeight: Math.min(position.maxHeight, 800),
        // No overflow hidden - let content scroll when needed
      };
    default:
      return baseStyles;
  }
};

const getOptimalPosition = (activeFeature: CommandBarModuleType) => {
  const minTopGap = 16;
  const minBottomGap = 16;
  const maxModuleHeight =
    activeFeature === 'ASK_AI'
      ? Math.min(window.innerHeight - minTopGap - minBottomGap, 730)
      : window.innerHeight - minTopGap - minBottomGap;

  // Special case for VIDEO_LIBRARY - align with action button when possible
  if (activeFeature === 'VIDEO_LIBRARY') {
    const buttonElement = querySelector(
      `[data-action-id="action-${activeFeature}"]`,
      ENV.VITE_WC_TAG_NAME,
    ) as HTMLButtonElement;

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      const idealBottom = window.innerHeight - rect.bottom;

      // Use the fixed 800px height for video library instead of maxModuleHeight
      const videoLibraryHeight = Math.min(maxModuleHeight, 800);

      // Check if we can align with button and stay within bounds
      const moduleTopIfAligned = rect.bottom - videoLibraryHeight;
      if (moduleTopIfAligned >= minTopGap && idealBottom >= minBottomGap) {
        // We can align with button and stay within bounds
        return {
          bottom: idealBottom,
          maxHeight: videoLibraryHeight,
          transform: 'translateY(0)',
        };
      }
    }

    // Fallback to bottom alignment if button alignment isn't possible
    return {
      bottom: minBottomGap,
      maxHeight: Math.min(maxModuleHeight, 800),
      transform: 'translateY(0)',
    };
  }

  const buttonElement = querySelector(
    `[data-action-id="action-${activeFeature}"]`,
    ENV.VITE_WC_TAG_NAME,
  ) as HTMLButtonElement;

  if (!buttonElement) {
    // If no button found, center the module in the available space
    return {
      bottom: minBottomGap,
      maxHeight: maxModuleHeight,
      transform: 'translateY(0)',
    };
  }

  const rect = buttonElement.getBoundingClientRect();

  // Calculate ideal position (aligned with button)
  const idealBottom = window.innerHeight - rect.bottom;

  // For other modules, prioritize alignment when possible
  // Priority 1: Check if we can align with button and stay within bounds
  const moduleTopIfAligned = rect.bottom - maxModuleHeight;
  if (moduleTopIfAligned >= minTopGap && idealBottom >= minBottomGap) {
    // We can align with button and stay within bounds
    // But let's double-check with actual maxHeight to ensure we don't go out of bounds
    const actualModuleTop = rect.bottom - maxModuleHeight;
    if (actualModuleTop >= minTopGap) {
      return {
        bottom: idealBottom,
        maxHeight: maxModuleHeight,
        transform: 'translateY(0)',
      };
    }
  }

  // Priority 2: If alignment would violate bounds, position within safe bounds
  const maxBottom = window.innerHeight - minBottomGap;
  const minBottom = minTopGap;

  // Use the ideal position if it fits, otherwise use the closest valid position
  const finalBottom = Math.max(minBottom, Math.min(maxBottom, idealBottom));

  return {
    bottom: finalBottom,
    maxHeight: maxModuleHeight,
    transform: 'translateY(0)',
  };
};

const mobileStyles = {
  position: 'fixed',
  right: '0px',
  marginRight: '0px',
  transform: 'translateY(50%)',
  height: '100dvh',
  width: '100vw',
} as const;

const defaultStyles = {
  position: 'fixed',
  right: '64px',
  marginRight: '16px',
  transform: 'translateY(50%)',
} as const;

const FeatureContentWrapper = ({ children, activeFeature, isExpanded }: FeatureContentWrapperProps) => {
  const isMobile = useIsMobile();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!activeFeature) return null;

  const maxHeight = getMaxAvailableHeight();
  const position = isMobile
    ? { bottom: 16, maxHeight: maxHeight, transform: 'translateY(0)' }
    : getOptimalPosition(activeFeature);

  // Force recalculation when window dimensions change
  const positionKey = `${windowDimensions.width}-${windowDimensions.height}-${activeFeature}`;

  return (
    <motion.div
      key={positionKey}
      layout
      initial={{ opacity: 0, y: 50, bottom: position.bottom }}
      animate={{
        opacity: 1,
        y: 0,
        bottom: position.bottom,
      }}
      exit={{ opacity: 0, y: 50 }}
      transition={COMPONENT_TRANSITIONS.FEATURE_CONTENT}
      style={isMobile ? mobileStyles : { ...defaultStyles, ...getModuleStyles(activeFeature, position) }}
    >
      <motion.div
        className="h-full"
        style={getInnerModuleStyles(activeFeature, position)}
        initial={{ width: isMobile ? '100%' : 450 }}
        animate={{ width: isMobile ? '100%' : isExpanded ? 750 : 450 }}
        transition={COMPONENT_TRANSITIONS.FEATURE_CONTENT_WIDTH}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FeatureContentWrapper;
