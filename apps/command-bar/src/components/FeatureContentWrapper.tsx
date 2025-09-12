import { motion } from 'framer-motion';
import React, { useCallback, useRef } from 'react';

import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

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
        // No forced height - let it size based on content
      };

    case 'VIDEO_LIBRARY':
      return {
        ...baseStyles,
        // No forced height - let it size based on content like ASK_AI
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
        // No forced height - let it size based on content
      };
    case 'VIDEO_LIBRARY':
      return {
        ...baseStyles,
        // Allow content to scroll when it exceeds available height
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const,
      };
    default:
      return baseStyles;
  }
};

const getOptimalPosition = (activeFeature: CommandBarModuleType) => {
  const minTopGap = 16;
  const minBottomGap = 16;
  const availableHeight = window.innerHeight - minTopGap - minBottomGap;

  const maxModuleHeight = activeFeature === 'ASK_AI' ? Math.min(availableHeight, 730) : availableHeight;

  // All modules align to the bottom with 16px gap
  if (activeFeature === 'VIDEO_LIBRARY') {
    return {
      bottom: minBottomGap,
      maxHeight: availableHeight, // Always fit within viewport
      transform: 'translateY(0)',
    };
  }

  // All other modules also align to the bottom
  return {
    bottom: minBottomGap,
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
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Optimized transition with requestAnimationFrame priority
  const optimizedTransition = useCallback(() => {
    return {
      duration: 0.3,
      ease: 'easeOut',
      // Use requestAnimationFrame for smoother animation
      type: 'tween' as const,
      // Prioritize animation over other tasks
      willChange: 'transform, opacity',
    };
  }, []);

  // Defer heavy content loading until after animation starts
  const [shouldRenderContent, setShouldRenderContent] = React.useState(false);

  React.useEffect(() => {
    if (activeFeature) {
      // Start animation immediately
      setShouldRenderContent(false);

      // Defer content rendering to next frame to prioritize animation
      animationFrameRef.current = requestAnimationFrame(() => {
        setShouldRenderContent(true);
      });
    } else {
      setShouldRenderContent(false);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeFeature]);

  if (!activeFeature) return null;

  const maxHeight = getMaxAvailableHeight();
  const position = isMobile
    ? { bottom: 16, maxHeight: maxHeight, transform: 'translateY(0)' }
    : getOptimalPosition(activeFeature);

  // Use a consistent key to prevent unmounting/remounting when switching modules
  const containerKey = 'feature-module-container';

  return (
    <motion.div
      key={containerKey}
      initial={{ opacity: 0, x: 8 }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{ opacity: 0, x: 8 }}
      transition={optimizedTransition()}
      style={{
        ...(isMobile ? mobileStyles : { ...defaultStyles, ...getModuleStyles(activeFeature, position) }),
        transformOrigin: 'right',
        bottom: position.bottom, // Explicitly set bottom position to ensure 16px gap
        // Optimize for animations
        willChange: 'transform, opacity',
        // Use GPU acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div
        className="h-full rounded-[20px] shadow-elevation-md"
        style={{
          ...getInnerModuleStyles(activeFeature, position),
          width: isMobile ? '100%' : activeFeature === 'VIDEO_LIBRARY' ? 750 : isExpanded ? 750 : 450,
          // Optimize content rendering
          contain: 'layout style paint',
        }}
      >
        {shouldRenderContent ? children : <div className="h-full w-full" />}
      </div>
    </motion.div>
  );
};

export default FeatureContentWrapper;
