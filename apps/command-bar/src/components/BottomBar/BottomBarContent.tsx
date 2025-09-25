import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandBarModuleType, CommandBarModuleConfigType } from '@meaku/core/types/api/configuration_response';

// Components
import { BottomBarInputField } from './BottomBarInputField';
import { BottomBarActionButton } from './BottomBarActionButton';

// Constants
import { BOTTOM_BAR_ANIMATIONS, BUTTON_SIZING } from './constants';
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
}) => {
  // Local state for input
  const [inputValue, setInputValue] = useState('');

  // Memoize animation configurations for better performance
  const contentAnimation = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        bottom: isAnimatingToCorner ? 0 : 2,
        left: isAnimatingToCorner ? 0 : 2,
        right: isAnimatingToCorner ? 0 : 2,
        top: isAnimatingToCorner ? 0 : 2,
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
      {/* Ask AI module - visible in both phases */}
      <AnimatePresence>
        {askAiModule && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isModulesReady ? 1 : 0,
              scale: isAnimatingToCorner ? 1 : isDynamicConfigLoading ? 1.1 : 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              width: {
                duration: 0.3,
                ease: 'easeOut',
              },
              height: {
                duration: 0.3,
                ease: 'easeOut',
              },
              opacity: {
                duration: isAnimatingToCorner ? 0.8 : 0.4,
                ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : [0.25, 0.46, 0.45, 0.94],
              },
              scale: {
                duration: isAnimatingToCorner ? 0.8 : 0.4,
                ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : [0.25, 0.46, 0.45, 0.94],
              },
            }}
            className="transition-all duration-300 ease-out"
            style={{
              width:
                isAnimatingToCorner || isDynamicConfigLoading
                  ? `${BUTTON_SIZING.ACTION_BUTTON.LARGE_SIZE}px`
                  : `${BUTTON_SIZING.ACTION_BUTTON.DEFAULT_SIZE}px`,
              height:
                isAnimatingToCorner || isDynamicConfigLoading
                  ? `${BUTTON_SIZING.ACTION_BUTTON.LARGE_SIZE}px`
                  : `${BUTTON_SIZING.ACTION_BUTTON.DEFAULT_SIZE}px`,
            }}
          >
            <BottomBarActionButton
              featureConfig={askAiModule}
              isActive={activeFeature === askAiModule.module_type}
              buttonSize={
                isAnimatingToCorner || isDynamicConfigLoading
                  ? BUTTON_SIZING.ACTION_BUTTON.LARGE_SIZE
                  : BUTTON_SIZING.ACTION_BUTTON.DEFAULT_SIZE
              }
              isAnimating={isAnimatingToCorner}
              onClick={onModuleClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input field - only show in Phase 2 (dynamic config complete AND modules ready) */}
      {isModulesReady && !isDynamicConfigLoading && (
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{
            opacity: !isAnimatingToCorner ? 1 : 0,
            width: isAnimatingToCorner ? '0px' : 'auto',
          }}
          transition={{
            duration: isAnimatingToCorner ? 0.8 : 0.3,
            delay: 0.1, // Start after width expansion begins
          }}
        >
          <BottomBarInputField
            value={inputValue}
            onChange={setInputValue}
            onSubmit={(questionText) => onInputSubmit(inputValue, questionText || '')}
            suggestedQuestions={suggestedQuestions}
            actionButtonSize={actionButtonSize}
          />
        </motion.div>
      )}

      {/* Other modules - only show in Phase 2 (dynamic config complete AND modules ready) */}
      {isModulesReady && !isDynamicConfigLoading && (
        <motion.div
          className="flex items-center"
          style={{ gap: `${BOTTOM_BAR_ANIMATIONS.LAYOUT.ACTION_BUTTON_GAP}px` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: !isAnimatingToCorner ? 1 : 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1, // Start after width expansion begins
            ease: 'easeOut',
          }}
        >
          {otherModules.map((featureConfig, index) => (
            <motion.div
              key={featureConfig.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: !isAnimatingToCorner ? 1 : 0,
                scale: !isAnimatingToCorner ? 1 : 1,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: isAnimatingToCorner ? 0.8 : 0.3,
                delay: isAnimatingToCorner ? 0 : index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="transition-all duration-300 ease-out"
              style={{
                width: isAnimatingToCorner ? '56px' : 'auto',
                height: isAnimatingToCorner ? '56px' : 'auto',
              }}
            >
              <BottomBarActionButton
                featureConfig={featureConfig}
                isActive={activeFeature === featureConfig.module_type}
                buttonSize={isAnimatingToCorner ? 56 : 42}
                isAnimating={isAnimatingToCorner}
                onClick={onModuleClick}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BottomBarContent;
