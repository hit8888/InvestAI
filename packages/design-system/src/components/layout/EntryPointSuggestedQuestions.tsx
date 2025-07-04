import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@breakout/design-system/lib/cn';
import { Suggestion } from './ChatMessages/Suggestion';
import { getSuggestionItemAnimation, suggestionContainerAnimation } from '@meaku/core/utils/entryPointAnimation';
import { SuggestedQuestionsShowingInCycle } from './ChatMessages/SuggestedQuestionsShowingInCycle';
import { EntryPointAlignment, EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';

type EntryPointSuggestedQuestionsProps = {
  showSuggestedQuestions: boolean;
  initialSuggestedQuestions: string[];
  handleSuggestedQuestionOnClick: (question: string) => void;
  showOneByOne?: boolean;
  questionAlignment?: EntryPointAlignmentType;
  invertTextColor?: boolean;
};

const EntryPointSuggestedQuestions = ({
  showSuggestedQuestions,
  initialSuggestedQuestions,
  handleSuggestedQuestionOnClick,
  showOneByOne = false,
  questionAlignment = EntryPointAlignment.LEFT,
  invertTextColor,
}: EntryPointSuggestedQuestionsProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const isQuestionAlignmentRight = questionAlignment === EntryPointAlignment.RIGHT;
  const isQuestionAlignmentLeft = questionAlignment === EntryPointAlignment.LEFT;
  const isQuestionAlignmentCenter = questionAlignment === EntryPointAlignment.CENTER;

  const handleSuggestedQuestionOnClickAndTrack = (question: string) => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.ENTRY_CLICKED_FIRST_TIME, { isAgentOpen: false });
    handleSuggestedQuestionOnClick(question);
  };

  return (
    <div
      className={cn({
        'flex w-full justify-start': showSuggestedQuestions && (isQuestionAlignmentRight || isQuestionAlignmentLeft),
        'flex w-fit justify-end': showSuggestedQuestions && isQuestionAlignmentCenter,
      })}
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
          <AnimatePresence>
            {showOneByOne ? (
              <SuggestedQuestionsShowingInCycle
                questions={initialSuggestedQuestions}
                showQuestions={showSuggestedQuestions}
                onQuestionClick={handleSuggestedQuestionOnClickAndTrack}
                questionAlignment={questionAlignment}
                invertTextColor={invertTextColor}
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
                    onSuggestedQuestionOnClick={handleSuggestedQuestionOnClickAndTrack}
                    itemIndex={index}
                    isEntryPointQuestion={true}
                    invertTextColor={invertTextColor}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default EntryPointSuggestedQuestions;
