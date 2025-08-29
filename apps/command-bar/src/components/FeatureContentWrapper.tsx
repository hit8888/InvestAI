import { motion } from 'framer-motion';
import React from 'react';

import { querySelector } from '@meaku/shared/utils/dom-utils';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { ENV } from '@meaku/shared/constants/env';

export interface FeatureContentWrapperProps {
  children: React.ReactNode;
  activeFeature: CommandBarModuleType | null;
  isExpanded: boolean;
}

const getActiveFeatureBottomOffset = (activeFeature: CommandBarModuleType) => {
  const buttonElement = querySelector(
    `[data-action-id="action-${activeFeature}"]`,
    ENV.VITE_WC_TAG_NAME,
  ) as HTMLButtonElement;

  if (!buttonElement) return 0;
  const rect = buttonElement.getBoundingClientRect();
  return window.innerHeight - rect.bottom;
};

const FeatureContentWrapper = ({ children, activeFeature, isExpanded }: FeatureContentWrapperProps) => {
  if (!activeFeature) return null;

  const bottom = getActiveFeatureBottomOffset(activeFeature);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, bottom: bottom }}
      animate={{
        opacity: 1,
        y: 0,
        bottom: bottom,
      }}
      exit={{ opacity: 0, y: 50 }}
      transition={{
        duration: 0.3,
        bottom: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        x: { duration: 0.3 },
        layout: { type: 'tween', duration: 0.4, ease: 'easeInOut' },
      }}
      style={{
        position: 'fixed',
        right: '64px',
        marginRight: '16px',
        transform: 'translateY(50%)',
      }}
    >
      <motion.div
        className="space-y-2"
        initial={{ width: 450 }}
        animate={{ width: isExpanded ? 680 : 450 }}
        transition={{ width: { duration: 0.3, ease: 'easeInOut' } }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FeatureContentWrapper;
