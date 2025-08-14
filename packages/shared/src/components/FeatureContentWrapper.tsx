import { motion } from 'framer-motion';
import React from 'react';

export interface FeatureContentWrapperProps {
  children: React.ReactNode;
  bottom: number;
  isExpanded: boolean;
}

const FeatureContentWrapper = ({ children, bottom, isExpanded }: FeatureContentWrapperProps) => {
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
        initial={{ width: 400 }}
        animate={{ width: isExpanded ? 680 : 400 }}
        transition={{ width: { duration: 0.3, ease: 'easeInOut' } }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FeatureContentWrapper;
