import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, LucideIcon } from '@neuraltrade/saral';
import { ANIMATION_TIMINGS } from '../../constants/animationTimings';
import { BUTTON_SIZING } from './constants';
import { RotatingText } from '@neuraltrade/shared/components/RotatingText';

interface RotatingQuestionButtonProps {
  questions: string[];
  onQuestionClick: (questionText?: string) => void;
  hasInput?: boolean;
}

export const RotatingQuestionButton = ({
  questions,
  onQuestionClick,
  hasInput = false,
}: RotatingQuestionButtonProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Destructure button sizing constants for cleaner code
  const { BASE_PADDING, CHAR_WIDTH, ICON_PADDING, SEND_ICON_WIDTH, MIN_QUESTION_WIDTH, HEIGHT } =
    BUTTON_SIZING.ROTATING_QUESTION;

  // Find the longest question to set button width
  const longestQuestion = questions.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    questions[0] || '',
  );

  // If no questions available, always show send icon
  const shouldShowSendIcon = hasInput || questions.length === 0;

  // Memoize button styles to avoid recalculation on every render
  const buttonStyles = useMemo(
    () => ({
      width: shouldShowSendIcon
        ? `${SEND_ICON_WIDTH}px`
        : `${BASE_PADDING + (longestQuestion.length * CHAR_WIDTH + ICON_PADDING)}px`,
      minWidth: shouldShowSendIcon ? `${SEND_ICON_WIDTH}px` : `${MIN_QUESTION_WIDTH}px`,
      height: `${HEIGHT}px`,
    }),
    [
      shouldShowSendIcon,
      longestQuestion.length,
      BASE_PADDING,
      CHAR_WIDTH,
      ICON_PADDING,
      SEND_ICON_WIDTH,
      MIN_QUESTION_WIDTH,
      HEIGHT,
    ],
  );

  return (
    <Button
      onClick={() => onQuestionClick(shouldShowSendIcon ? undefined : questions[currentIndex])}
      variant={shouldShowSendIcon ? 'default' : 'outline_primary'}
      className={`justify-start rounded-[108px] border-foreground text-foreground ${shouldShowSendIcon ? 'px-1.5' : ''}`}
      style={buttonStyles}
      hasWipers={!shouldShowSendIcon}
    >
      <div className="relative flex items-center justify-center">
        {/* Preload send icon - always rendered but hidden */}
        <LucideIcon name="send-horizontal" className="invisible absolute size-4 opacity-0" />

        {/* Show/hide content based on state */}
        <AnimatePresence mode="wait">
          {shouldShowSendIcon ? (
            <motion.div
              key="send-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center"
            >
              <LucideIcon name="send-horizontal" className="ml-0.5 size-4" />
            </motion.div>
          ) : (
            <RotatingText
              texts={questions}
              rotationInterval={ANIMATION_TIMINGS.DELAYS.QUESTION_ROTATION_INTERVAL * 1000}
              transitionDelay={ANIMATION_TIMINGS.DELAYS.QUESTION_TRANSITION * 1000}
              pauseOnHover={true}
              className="flex items-center gap-2 text-[12px]"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onIndexChange={setCurrentIndex}
            />
          )}
        </AnimatePresence>
      </div>
    </Button>
  );
};
