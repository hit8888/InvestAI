import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CommandBarModuleType, CommandBarModuleConfigType } from '@neuraltrade/core/types/api/configuration_response';

// Components
import { BottomBarInputField } from './BottomBarInputField';
import { BottomBarActionButton } from './BottomBarActionButton';

// Constants
import { BUTTON_SIZING } from './constants';

interface BottomBarContentProps {
  activeFeature: CommandBarModuleType | null;
  actionButtonSize: number;
  isDynamicConfigLoading: boolean;
  isAnimatingToCorner: boolean;
  isInputReady: boolean;
  isModulesReady: boolean;
  askAiModule: CommandBarModuleConfigType | null;
  otherModules: CommandBarModuleConfigType[];
  suggestedQuestions: string[];
  welcomeMessages: string[];
  onModuleClick: (config: CommandBarModuleConfigType) => void;
  onInputSubmit: (inputValue: string, questionText: string) => void;
}

const BottomBarContent: React.FC<BottomBarContentProps> = ({
  activeFeature,
  actionButtonSize,
  isAnimatingToCorner,
  isModulesReady,
  askAiModule,
  otherModules,
  suggestedQuestions,
  welcomeMessages,
  onModuleClick,
  onInputSubmit,
}) => {
  // Local state for input
  const [inputValue, setInputValue] = useState('');

  // Simple static rendering - no animations
  if (!isModulesReady) {
    return null;
  }

  return (
    <div className="relative">
      {/* Multi-colored glow effect - BEHIND entire container (input + all modules) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-behind-content rounded-[40px] opacity-75 blur-[40px]"
        style={{
          scale: 1.1,
        }}
        animate={{
          background: [
            'conic-gradient(from 0deg, #8b5cf6, #db2777, #f97316, #8b5cf6)',
            'conic-gradient(from 360deg, #8b5cf6, #db2777, #f97316, #8b5cf6)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="relative z-root flex items-center"
        style={{
          gap: isAnimatingToCorner ? 0 : `${BUTTON_SIZING.ELEMENT_GAP}px`,
          ...(isAnimatingToCorner &&
            ({
              filter: 'drop-shadow(0 0 0 transparent)',
              '--shadow-elevation-md': '0 0 0 transparent',
            } as React.CSSProperties)),
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Input bar - shrinks to 56px during exit */}
        <motion.div
          animate={{
            width: isAnimatingToCorner ? `${BUTTON_SIZING.BUTTON_SIZE}px` : 'auto',
            opacity: isAnimatingToCorner ? 0 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: isAnimatingToCorner ? 'drop-shadow(0 0 0 transparent)' : undefined }}
        >
          <BottomBarInputField
            value={inputValue}
            onChange={setInputValue}
            onSubmit={(questionText) => onInputSubmit(inputValue, questionText || '')}
            suggestedQuestions={suggestedQuestions}
            welcomeMessages={welcomeMessages}
            actionButtonSize={actionButtonSize}
            askAiModule={askAiModule}
            onModuleClick={onModuleClick}
          />
        </motion.div>

        {/* Ask AI as circular button - appears on top during exit */}
        {askAiModule && (
          <motion.div
            className="absolute left-0 z-root"
            style={{
              filter: isAnimatingToCorner ? 'drop-shadow(0 0 0 transparent)' : undefined,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isAnimatingToCorner ? 1 : 0,
              scale: isAnimatingToCorner ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: isAnimatingToCorner ? 0.4 : 0 }}
          >
            <div
              style={{
                boxShadow: isAnimatingToCorner ? 'none !important' : undefined,
                ...(isAnimatingToCorner && ({ '--shadow-elevation-md': '0 0 0 transparent' } as React.CSSProperties)),
              }}
            >
              <BottomBarActionButton
                featureConfig={askAiModule}
                isActive={activeFeature === askAiModule.module_type}
                buttonSize={BUTTON_SIZING.BUTTON_SIZE}
                isAnimating={isAnimatingToCorner}
                onClick={onModuleClick}
              />
            </div>
          </motion.div>
        )}

        {/* Other module buttons - collapse to Ask AI position during exit */}
        {otherModules.map((featureConfig) => (
          <motion.div
            key={featureConfig.id}
            className={`${isAnimatingToCorner ? 'absolute' : 'relative'} z-root`}
            style={{
              left: isAnimatingToCorner ? 0 : 'auto',
              top: isAnimatingToCorner ? 0 : 'auto',
              filter: isAnimatingToCorner ? 'drop-shadow(0 0 0 transparent)' : undefined,
            }}
            initial={false}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              style={{
                boxShadow: isAnimatingToCorner ? 'none !important' : undefined,
                ...(isAnimatingToCorner && ({ '--shadow-elevation-md': '0 0 0 transparent' } as React.CSSProperties)),
              }}
            >
              <BottomBarActionButton
                featureConfig={featureConfig}
                isActive={activeFeature === featureConfig.module_type}
                buttonSize={BUTTON_SIZING.BUTTON_SIZE}
                isAnimating={isAnimatingToCorner}
                onClick={onModuleClick}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BottomBarContent;
