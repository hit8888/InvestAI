import React from 'react';
import { motion } from 'framer-motion';

interface BottomBarShimmerProps {
  actionButtonSize: number;
}

/**
 * Shimmer effect for bottom bar while dynamic API is loading
 * Shows 4 circle placeholders to match maximum module count
 */
export const BottomBarShimmer: React.FC<BottomBarShimmerProps> = ({ actionButtonSize }) => {
  return (
    <div className="flex items-center" style={{ gap: '12px' }}>
      {/* Show 4 shimmer circles to match max module count */}
      {[1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="rounded-full bg-gray-200"
          style={{
            width: `${actionButtonSize}px`,
            height: `${actionButtonSize}px`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2, // Stagger the shimmer effect
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default BottomBarShimmer;
