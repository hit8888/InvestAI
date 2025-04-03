import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@breakout/design-system/lib/cn';
import { Suggestion } from '@breakout/design-system/components/layout/Suggestion';
import {
  floatingAnimation,
  suggestionContainerAnimation,
  getSuggestionItemAnimation,
} from '@meaku/core/utils/entryPointAnimation';
import { SuggestedQuestionsShowingInCycle } from './SuggestedQuestionsShowingInCycle';
import { EntryPointAlignment, EntryPointAlignmentType } from '@meaku/core/types/entryPoint';

type EntryPointSuggestedQuestionsProps = {
  showSuggestedQuestions: boolean;
  initialSuggestedQuestions: string[];
  handleSuggestedQuestionOnClick: (question: string) => void;
  showBouncingEffect: boolean | undefined;
  showOneByOne?: boolean;
  questionAlignment?: EntryPointAlignmentType;
};

const EntryPointSuggestedQuestions = ({
  showSuggestedQuestions,
  initialSuggestedQuestions,
  handleSuggestedQuestionOnClick,
  showBouncingEffect,
  showOneByOne = false,
  questionAlignment = EntryPointAlignment.LEFT,
}: EntryPointSuggestedQuestionsProps) => {
  const isQuestionAlignmentRight = questionAlignment === EntryPointAlignment.RIGHT;
  const isQuestionAlignmentLeft = questionAlignment === EntryPointAlignment.LEFT;
  const isQuestionAlignmentCenter = questionAlignment === EntryPointAlignment.CENTER;

  return (
    <motion.div
      className={cn({
        'flex w-full justify-start': showSuggestedQuestions && (isQuestionAlignmentRight || isQuestionAlignmentLeft),
        'flex w-full justify-end': showSuggestedQuestions && isQuestionAlignmentCenter,
      })}
      variants={showBouncingEffect ? floatingAnimation : undefined}
      initial="initial"
      animate="animate"
    >
      <motion.div
        variants={suggestionContainerAnimation}
        initial="initial"
        animate="animate"
        className={cn('flex items-center gap-4 transition-[width] duration-150 ease-in-out', {
          'w-0': !showSuggestedQuestions,
          'max-w-[800px] overflow-hidden': showSuggestedQuestions && !showOneByOne,
          'w-full': showSuggestedQuestions && showOneByOne,
          'justify-end': isQuestionAlignmentRight && showSuggestedQuestions,
          'justify-center': isQuestionAlignmentCenter && showSuggestedQuestions,
          'justify-start': isQuestionAlignmentLeft && showSuggestedQuestions,
        })}
      >
        {showSuggestedQuestions && (
          <AnimatePresence mode="wait">
            {showOneByOne ? (
              <SuggestedQuestionsShowingInCycle
                questions={initialSuggestedQuestions}
                showQuestions={showSuggestedQuestions}
                onQuestionClick={handleSuggestedQuestionOnClick}
                questionAlignment={questionAlignment}
              />
            ) : (
              initialSuggestedQuestions.map((question, index) => (
                <motion.div
                  key={question}
                  variants={getSuggestionItemAnimation(questionAlignment)}
                  className="rounded-full bg-white"
                >
                  <Suggestion
                    question={question}
                    onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
                    itemIndex={index}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EntryPointSuggestedQuestions;
