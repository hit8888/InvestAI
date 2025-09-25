import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandBarModuleType, CommandBarModuleConfigType } from '@meaku/core/types/api/configuration_response';

// Components
import { BottomBarInputField } from './BottomBarInputField';
import { BottomBarActionButton } from './BottomBarActionButton';
import BottomBarShimmer from './BottomBarShimmer';

// Constants
import { BOTTOM_BAR_ANIMATIONS } from './constants';
import { TRANSITION_PRESETS } from '../../constants/animationTimings';

interface BottomBarContentProps {
  activeFeature: CommandBarModuleType | null;
  actionButtonSize: number;
  isDynamicConfigLoading: boolean;
  isAnimatingToCorner: boolean;
  isModulesReady: boolean;
  askAiModule: CommandBarModuleConfigType | null;
  otherModules: CommandBarModuleConfigType[];
  suggestedQuestions: string[];
  onModuleClick: (config: CommandBarModuleConfigType) => void;
  onInputSubmit: (inputValue: string, questionText: string) => void;
  primaryPlaceholder: string | string[];
}

const BottomBarContent: React.FC<BottomBarContentProps> = ({
  activeFeature,
  actionButtonSize,
  isDynamicConfigLoading,
  isAnimatingToCorner,
  isModulesReady,
  askAiModule,
  otherModules,
  suggestedQuestions,
  onModuleClick,
  onInputSubmit,
  primaryPlaceholder,
}) => {
  // Local state for input
  const [inputValue, setInputValue] = useState('');

  // Memoize animation configurations for better performance
  const contentAnimation = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        bottom: isAnimatingToCorner ? 0 : 4,
        left: isAnimatingToCorner ? 0 : 4,
        right: isAnimatingToCorner ? 0 : 4,
        top: isAnimatingToCorner ? 0 : 4,
        padding: isAnimatingToCorner ? '0px' : '8px',
      },
    }),
    [isAnimatingToCorner],
  );

  const contentTransition = useMemo(
    () => ({
      duration: isAnimatingToCorner ? 0.8 : 0.3,
      delay: isAnimatingToCorner ? 0 : 0.2,
      ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : TRANSITION_PRESETS.OPACITY.ease,
    }),
    [isAnimatingToCorner],
  );

  return (
    <motion.div
      className="absolute flex items-center justify-start gap-3 rounded-[40px] bg-background"
      {...contentAnimation}
      transition={contentTransition}
    >
      {/* Ask AI module - always visible */}
      <AnimatePresence>
        {askAiModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isModulesReady ? 1 : 0,
              width: isAnimatingToCorner ? '56px' : `${actionButtonSize}px`,
              height: isAnimatingToCorner ? '56px' : `${actionButtonSize}px`,
            }}
            transition={{
              duration: isAnimatingToCorner ? 0.8 : 0.3,
              ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : 'easeOut',
            }}
          >
            <BottomBarActionButton
              featureConfig={askAiModule}
              isActive={activeFeature === askAiModule.module_type}
              buttonSize={isAnimatingToCorner ? 56 : actionButtonSize}
              isAnimating={isAnimatingToCorner}
              onClick={onModuleClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input field - gets clipped when bar shrinks */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isModulesReady && !isAnimatingToCorner ? 1 : 0,
          width: isAnimatingToCorner ? '0px' : 'auto',
        }}
        transition={{ duration: isAnimatingToCorner ? 0.8 : 0.3 }}
      >
        <BottomBarInputField
          value={inputValue}
          onChange={setInputValue}
          onSubmit={(questionText) => onInputSubmit(inputValue, questionText || '')}
          suggestedQuestions={suggestedQuestions}
          actionButtonSize={actionButtonSize}
          primaryPlaceholder={primaryPlaceholder}
        />
      </motion.div>

      {/* Other modules - get clipped when bar shrinks */}
      <motion.div className="flex items-center" style={{ gap: `${BOTTOM_BAR_ANIMATIONS.LAYOUT.ACTION_BUTTON_GAP}px` }}>
        {/* Synchronized fade transition between shimmer and modules */}
        <AnimatePresence mode="wait">
          {isDynamicConfigLoading ? (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2, // Faster shimmer exit
                ease: 'easeOut',
              }}
            >
              <BottomBarShimmer actionButtonSize={actionButtonSize} />
            </motion.div>
          ) : (
            <motion.div
              key="modules"
              initial={{ opacity: 0 }}
              animate={{ opacity: isModulesReady && !isAnimatingToCorner ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1, // Start modules slightly before shimmer fully exits
                ease: 'easeOut',
              }}
              className="flex items-center"
              style={{ gap: `${BOTTOM_BAR_ANIMATIONS.LAYOUT.ACTION_BUTTON_GAP}px` }}
            >
              {otherModules.map((featureConfig, index) => (
                <motion.div
                  key={featureConfig.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isModulesReady && !isAnimatingToCorner ? 1 : 0,
                    width: isAnimatingToCorner ? '0px' : 'auto',
                    height: isAnimatingToCorner ? '0px' : 'auto',
                  }}
                  transition={{
                    duration: isAnimatingToCorner ? 0.8 : 0.3,
                    delay: isAnimatingToCorner ? 0 : index * 0.05, // Reduced stagger for smoother appearance
                    ease: 'easeOut',
                  }}
                >
                  <BottomBarActionButton
                    featureConfig={featureConfig}
                    isActive={activeFeature === featureConfig.module_type}
                    buttonSize={actionButtonSize}
                    isAnimating={isAnimatingToCorner}
                    onClick={onModuleClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default BottomBarContent;
