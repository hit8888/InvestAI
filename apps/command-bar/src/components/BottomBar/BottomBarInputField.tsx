import React, { useCallback, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUTTON_SIZING } from './constants';
import { CommandBarModuleConfigType } from '@meaku/core/types/api/configuration_response';
import { LucideIcon } from '@meaku/saral';
import BlackTooltip from '@meaku/shared/components/BlackTooltip';
import { useCommandBarStore } from '@meaku/shared/stores/useCommandBarStore';
import FallbackOrb from '@meaku/shared/features/ask-ai/components/FallbackOrb';
import { OnlineIndicator } from '@meaku/shared/components/AvatarDisplay';
import { RotatingText } from '@meaku/shared/components/RotatingText';
import { ANIMATION_TIMINGS } from '../../constants/animationTimings';

interface BottomBarInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (questionText?: string) => void;
  suggestedQuestions: string[];
  welcomeMessages: string[];
  actionButtonSize: number; // Kept for backwards compatibility but not used (uses BUTTON_SIZING constants)
  askAiModule: CommandBarModuleConfigType | null;
  onModuleClick: (config: CommandBarModuleConfigType) => void;
}

/**
 * Input field component for BottomCenterBar
 * Handles text input with Ask AI icon on the left (custom image or fallback icon)
 */
export const BottomBarInputField: React.FC<BottomBarInputFieldProps> = ({
  value,
  onChange,
  onSubmit,
  suggestedQuestions,
  welcomeMessages,
  askAiModule,
  onModuleClick,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessagesToShow = (welcomeMessages?.length > 0 ? welcomeMessages : suggestedQuestions) ?? [];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit],
  );

  const handleQuestionClick = (question: string) => {
    onChange(question);
    onSubmit(question);
  };

  const handlePlaceholderClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleAskAiIconClick = useCallback(() => {
    if (askAiModule) {
      onModuleClick(askAiModule);
    }
  }, [askAiModule, onModuleClick]);

  // Get config to access orb_config (matching logic from commandBarActionConfigs.tsx)
  const { config } = useCommandBarStore();
  const { orb_config: orbConfig } = config.style_config ?? {};

  // Get custom icon URL (same logic as AskAIActionConfig)
  const customIconUrl = askAiModule?.icon_asset?.public_url ?? undefined;

  // Use scaled icon size from constants
  const iconSize = BUTTON_SIZING.ICON_SIZE;

  const iconContent = useMemo(() => {
    if (!askAiModule) return null;

    // Match the logic from AskAIActionConfig in commandBarActionConfigs.tsx:
    // 1. First check: customIconUrl from featureConfig
    // 2. Second check: orbConfig?.logo_url
    // 3. Third: FallbackOrb
    const renderIconElement = () => {
      if (customIconUrl) {
        return (
          <div
            className="mt-1.5 flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10"
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          >
            <img
              src={customIconUrl}
              alt={askAiModule?.name || 'Ask AI'}
              className="size-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>
        );
      }
      if (orbConfig?.logo_url) {
        return (
          <div
            className="mt-1.5 flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10"
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          >
            <img
              src={orbConfig.logo_url}
              alt="Ask AI"
              className="size-full object-cover"
              loading="lazy"
              draggable={false}
            />
            {orbConfig?.show_online_indicator && (
              <OnlineIndicator position="bottom-right" size={12} borderWidth={2} offset={3} />
            )}
          </div>
        );
      }
      return (
        <div className="mb-1">
          <FallbackOrb size={iconSize} />
        </div>
      );
    };

    const iconElement = renderIconElement();

    return (
      <BlackTooltip content={askAiModule.name} side="top">
        <button
          type="button"
          onClick={handleAskAiIconClick}
          className="flex shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
          aria-label={`Open ${askAiModule.name}`}
        >
          {iconElement}
        </button>
      </BlackTooltip>
    );
  }, [customIconUrl, orbConfig, askAiModule, iconSize, handleAskAiIconClick]);

  return (
    <div className="relative w-full">
      {/* Suggested questions list - appears above input when focused */}
      <AnimatePresence>
        {isFocused && suggestedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-full left-0 right-0 z-dropdown mb-2 rounded-2xl bg-background p-2 shadow-[0_0_20px_rgba(0,0,0,0.15)]"
          >
            <div className="flex flex-col">
              {/* Try asking label */}
              <div className="mb-1 flex h-6 w-fit items-center justify-center rounded-full bg-card px-2.5">
                <span className="text-xs text-primary">Try asking...</span>
              </div>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onMouseDown={() => handleQuestionClick(question)}
                  className="rounded-full px-2.5 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-card"
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          height: `${BUTTON_SIZING.INPUT_HEIGHT}px`,
          minWidth: `${BUTTON_SIZING.INPUT_MIN_WIDTH}px`,
        }}
        className="relative flex w-full items-center gap-2 overflow-hidden rounded-[40px] bg-background pr-1.5 shadow-sm"
      >
        {/* Ask AI icon on the left */}
        {iconContent && <div className="ml-1.5">{iconContent}</div>}

        <div className="relative h-full flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-0"
          />
          {/* Rotating placeholder text - only visible when input is empty and not focused */}
          {value.trim().length === 0 && !isFocused && welcomeMessagesToShow.length > 0 && (
            <div className="pointer-events-none absolute left-0 top-0 flex h-full items-center">
              <div className="pointer-events-auto cursor-text" onClick={handlePlaceholderClick}>
                <RotatingText
                  texts={welcomeMessagesToShow}
                  rotationInterval={ANIMATION_TIMINGS.DELAYS.QUESTION_ROTATION_INTERVAL * 1000}
                  transitionDelay={ANIMATION_TIMINGS.DELAYS.QUESTION_TRANSITION * 1000}
                  pauseOnHover={true}
                  className="text-sm text-muted-foreground"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Send icon on the right - sized proportionally with equidistant spacing, only when input has text */}
        <AnimatePresence>
          {value.trim().length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              onClick={() => onSubmit()}
              className="flex shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:bg-primary/90"
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              type="button"
            >
              <LucideIcon
                name="send-horizontal"
                className="ml-0.5 size-5 fill-primary-foreground stroke-[1.5px] text-primary-foreground [&_path:last-child]:text-primary"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
