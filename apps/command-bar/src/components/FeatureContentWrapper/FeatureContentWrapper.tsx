import { motion } from 'framer-motion';
import React from 'react';

import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';
import { LAYOUT_CONSTANTS } from './constants';

import {
  useModulePositioning,
  useModuleStyles,
  useInnerModuleStyles,
  useModuleAnimation,
  getBaseLayoutStyles,
} from './hooks';

export interface FeatureContentWrapperProps {
  children: React.ReactNode;
  activeFeature: CommandBarModuleType | null;
  isExpanded: boolean;
}

const FeatureContentWrapper = ({ children, activeFeature, isExpanded }: FeatureContentWrapperProps) => {
  const isMobile = useIsMobile();
  const { screenWidth, screenHeight } = useScreenSize();

  // Use custom hooks for positioning, styling, and animation
  const position = useModulePositioning(activeFeature, screenHeight, isMobile);
  const moduleStyles = useModuleStyles(activeFeature, position);
  const innerModuleStyles = useInnerModuleStyles(activeFeature, position, isExpanded, isMobile);
  const { shouldRenderContent, animationConfig } = useModuleAnimation(activeFeature);

  // Create animation target state
  const width = !isMobile ? (isExpanded ? LAYOUT_CONSTANTS.EXPANDED_WIDTH : LAYOUT_CONSTANTS.DEFAULT_WIDTH) : undefined;
  const animateTarget = {
    ...animationConfig.animate,
    width,
    right: LAYOUT_CONSTANTS.DESKTOP_RIGHT_OFFSET,
  };

  if (!activeFeature || !position || !moduleStyles || !innerModuleStyles) return null;

  // Use a key that includes screen dimensions to force re-calculation on resize
  const containerKey = `feature-module-container-${screenWidth}-${screenHeight}`;

  return (
    <motion.div
      key={containerKey}
      initial={animationConfig.initial}
      animate={animateTarget}
      exit={animationConfig.exit}
      transition={animationConfig.transition}
      style={{
        ...getBaseLayoutStyles(isMobile),
        ...moduleStyles,
        transformOrigin: 'right',
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
          ...innerModuleStyles,
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
